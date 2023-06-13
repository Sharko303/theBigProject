import { handleError, createController } from './controller.js'

// J'importe le model qui va bien
import model from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv';

dotenv.config()

const controller = createController(model)

// J'exporte mon modèle
export default {
    ...controller,

    login: async function (request, response) {
        const { username, password } = request.body || {};
        if (!username || !password) {
            response.status(401).json({ status: 'error', message: 'Entrez un nom de compte et un mot de passe !' });
            return;
        }

        try {
            const user = (await model.getBy({ username }))[0];
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    response.cookie("Authentification", user.token, {
                        maxAge: 36000 * 24 * 365,
                        httpOnly: true
                    })
                    response.status(200).json({ token: user.token });
                    return;
                }
            }
            response.status(401).json({ status: 'error', message: "Mauvais mot de passe ou utilisateur" });
        } catch (err) {
            console.log(err)
            response.status(500).json({ status: 'error', message: "server error" });
        }
    },

    get: async function (req, res) {
        if (req.params.id == 'me') {
            res.json(req.user)
        } else {
            controller.get(req,res)
        }
    },

    post: async function (req, res) {
        let username = req?.body?.username;
        let password = req?.body?.password;
        let passwordRetype = req?.body?.passwordRetype;
        let email = req?.body?.email;
        if (username && password && email && password == passwordRetype) {
            const possibleExistingUser = await model.getBy({ username, email })
            if (possibleExistingUser.length > 0) {
                res.status(401).json({ status: 'error', message: 'Erreur : nom de compte ou adresse mail déjà utilisé' });
                return
            }

            const token = jwt.sign(
                {
                    username: username
                },
                //SecretOrPublicKey
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            )
            // create user grace au model
            req.body = {
                username: username,
                password: password,
                email: email,
                token: token
            }

            const next = await controller.post(req, res)
            console.log(next)
            if (next) {
                const confirmationUrl = `http://localhost:8080/ws/users/confirm?token=${token}`;
                sgMail.setApiKey(process.env.API_KEY);
                console.log(process.env.API_KEY)
                const confirmationEmail = {
                    to: email,
                    from: 'e.sport.tournois@gmail.com',
                    subject: 'Confirmation d\'inscription',
                    html: `
            <p>Bonjour ${username},</p>
            <p>Nous sommes ravis de vous compter parmi nos inscrits à eSport Tournois !</p>
            <p>Pour confirmer votre adresse e-mail, veuillez cliquer sur le lien ci-dessous :</p>
            <p><a href="${confirmationUrl}">Confirmer mon compte</a></p>
            <p>Merci de votre confiance !</p>
            <p>L'équipe d'eSport Tournois</p>
          `
                };

                console.log(await sgMail.send(confirmationEmail));

            }
        }
    },

    confirmMail: async function (req, res) {
        const token = req.query.token;
        try {
            //await requete.getToken(token)
            const user = (await model.getBy({token}))[0];
            if (!user) {
                //res.redirect('/connexion?error=inexistant');
                res.status(400).json({message:"Lien invalide"})
                return;
            }
            const newVal = {
                active: true,
                token: jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: "1y" })
            };
            await model.update(user.id, newVal);
            /* res.redirect('/connexion?success=true'); */
            res.json({message:"Votre utilisateur a bien été validé, vous pouvez fermer cette fenetre et vous connecter via l'interface"})
        } catch (error) {
            /* res.redirect('/connexion?error=true'); */
            console.log(error)
            res.status(400).json({message:"Lien invalide 2"})
        }
    }
}