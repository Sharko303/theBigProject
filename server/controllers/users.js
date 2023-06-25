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

    login: async function (req, res) {
        // Récupération des données de connexion (nom d'utilisateur et mot de passe)
        const { username, password } = req.body || {};

        // Vérification des données de connexion
        if (!username || !password) {
            res.status(401).json({ status: 'error', message: 'Entrez un nom de compte et un mot de passe !' });
            return;
        }

        try {
            // Recherche de l'utilisateur dans la base de données en utilisant le nom d'utilisateur
            const user = (await model.getBy({ username }))[0];

            // Vérification du nom d'utilisateur et du mot de passe
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    // Génération d'un token d'authentification
                    const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: "1h" });

                    // Configuration du cookie d'authentification
                    res.cookie("Authentification", user.token, {
                        maxAge: 36000 * 24 * 365,
                        httpOnly: true
                    });

                    // Envoi du token d'authentification en réponse
                    res.status(200).json({ token: user.token });
                    return;
                }
            }

            // Si les informations d'identification sont incorrectes, renvoyer une erreur
            res.status(401).json({ status: 'error', message: "Mauvais mot de passe ou utilisateur" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 'error', message: "server error" });
        }
    },

    logout: async function (req, res) {
        // Suppression du cookie d'authentification en réglant sa date d'expiration à une date passée
        res.clearCookie('Authentification');

        // Mise à jour du champ token de l'utilisateur en le définissant sur null
        const token = req.cookies?.Authentification;
        console.log("token :", token);
        //if (token) {
        //    await model.update(req.user.id, { token: null });
        //}

        // Renvoi d'une réponse indiquant que l'utilisateur a été déconnecté avec succès
        res.status(200).json({ message: 'Déconnexion réussie' });
    },

    get: async function (req, res) {
        if (req.params.id == 'me') {
            console.log(req.user);
            // Suppression du token et du mot de passe de l'utilisateur avant de le renvoyer
            delete req.user.token;
            delete req.user.password;
            res.json(req.user);
        } else {
            controller.get(req, res);
        }
    },

    post: async function (req, res) {
        // Récupération des données de création d'un utilisateur (nom d'utilisateur, mot de passe, email)
        let username = req?.body?.username;
        let password = req?.body?.password;
        let passwordRetype = req?.body?.passwordRetype;
        let email = req?.body?.email;

        // Vérification des données de création d'utilisateur
        if (username && password && email && password == passwordRetype) {
            // Vérification de l'existence d'un utilisateur avec le même nom d'utilisateur ou email
            const possibleExistingUser = await model.getBy({ username, email });
            if (possibleExistingUser.length > 0) {
                res.status(401).json({ status: 'error', message: 'Erreur : nom de compte ou adresse mail déjà utilisé' });
                return;
            }

            // Génération d'un token d'authentification
            const token = jwt.sign(
                {
                    username: username
                },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Préparation des données de création d'utilisateur
            req.body = {
                username: username,
                password: password,
                email: email,
                token: token
            };

            // Appel de la fonction de création d'utilisateur du contrôleur
            const next = await controller.post(req, res);
            console.log(next);

            // Envoi de l'email de confirmation si la création d'utilisateur a réussi
            if (next) {
                const confirmationUrl = `http://localhost:8080/ws/users/confirm?token=${token}`;
                sgMail.setApiKey(process.env.API_KEY);
                console.log(process.env.API_KEY);
                const confirmationEmail = {
                    to: email,
                    from: 'e.sport.tournois@gmail.com',
                    subject: "Confirmation d'inscription",
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
        // Récupération du token de confirmation à partir des paramètres de la requête
        const token = req.query.token;

        try {
            // Recherche de l'utilisateur dans la base de données en utilisant le token de confirmation
            const user = (await model.getBy({ token }))[0];

            // Vérification de l'existence de l'utilisateur avec le token de confirmation
            if (!user) {
                res.status(400).json({ message: "Lien invalide" });
                return;
            }

            // Mise à jour des informations de l'utilisateur pour le valider et générer un nouveau token
            const newVal = {
                active: true,
                token: jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: "1y" })
            };
            await model.update(user.id, newVal);

            // Renvoi d'une réponse indiquant que l'utilisateur a été validé avec succès
            res.json({ message: "Votre utilisateur a bien été validé, vous pouvez fermer cette fenêtre et vous connecter via l'interface" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Lien invalide" });
        }
    }

}