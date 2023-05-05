import * as requete from '../models/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'

//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
export async function identification(request, response) {
  const { username, password } = request.body || {};
  if (!username || !password) {
    response.status(401).json({ status: 'error', message: 'Entrez un nom de compte et un mot de passe !' });
    return;
  }

  try {
    const salt = await requete.getSalt(username);
    if (!salt) {
      response.status(401).json({ status: 'error', message: 'Aucun compte trouvé avec ce nom d\'utilisateur' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, salt);
    const user = await requete.getUser(username, passwordHash);
    if (!user) {
      response.status(401).json({ status: 'error', message: 'Aucun compte trouvé avec ce nom d\'utilisateur et ce mot de passe' });
      return;
    }

    const token = await requete.getToken(username);
    response.status(200).json({ status: 'success', message: 'Données envoyées avec succès', token });
  } catch (err) {
    response.status(401).json({ status: 'error', message: err.message });
  }
}

export async function inscription(request, response) {
  let username = request?.body?.username;
  let password = request?.body?.password;
  let passwordRetype = request?.body?.passwordRetype;
  let email = request?.body?.email;
  const secretKey = crypto.randomBytes(64).toString('hex');
  if (username && password && email && password == passwordRetype && !(await requete.alreadyUsed(username, email))) {
    console.log('on passe la condition')
    const saltRounds = 10; // nombre de fois que le mot de passe sera hashé
    const salt = bcrypt.genSaltSync(saltRounds, saltRounds + saltRounds + saltRounds + password);
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    let passwordHash = bcrypt.hashSync(password, salt); //  Hash le mot de passe avec le sel
    const confirmationUrl = `http://localhost:8080/ws/confirm-email?token=${token}`;
    try {
      if (await requete.setUser(username, passwordHash, email, salt, confirmationUrl, token)) {
        console.log('on essaye sgMail');
        sgMail.setApiKey('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');

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

        await sgMail.send(confirmationEmail);
      }

      //const token = jwt.sign({ username }, 'secret');
      response.status(200).json({ status: 'success', message: 'Inscription envoyées avec succès' });

    } catch (error) {
      response.status(500).json({ status: 'error', message: 'Erreur : de connexion à la base de données' });
    }
  } else {
    response.status(401).json({ status: 'error', message: 'Erreur : nom de compte ou adresse mail déjà utilisé' });
  }
}

export async function confirmMail(req, res) {
  const token = req.query.token;
  console.log('on est dedans')
  let email
  let tokenUser
  try {
    //await requete.getToken(token)
    const userInfo = await requete.getUserInfo(token)
    tokenUser = userInfo.token;
    email = userInfo.email;
    if (!tokenUser || userInfo.active == 1) {
      res.redirect('/connexion?error=already_confirmed');
      return;
    }
      await requete.setAccountActive(token);
      res.redirect('/connexion?success=true');
  } catch (error) {
    res.redirect('/connexion?error=true')
  }
}

