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

    const token = jwt.sign({ username }, 'secret');
    response.status(200).json({ status: 'success', message: 'Données envoyées avec succès', token });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur ou du salt:', err);
    response.status(401).json({ status: 'error', message: 'Aucun compte trouvé avec ce nom d\'utilisateur et ce mot de passe' });
  }
}

export async function inscription(request, response) {
  let username = request?.body?.username;
  let password = request?.body?.password;
  let passwordRetype = request?.body?.passwordRetype;
  let email = request?.body?.email;
  const secretKey = crypto.randomBytes(64).toString('hex');
  if (username && password && email && password == passwordRetype) {
    console.log('on passe la condition')
    const saltRounds = 10; // nombre de fois que le mot de passe sera hashé
    const salt = bcrypt.genSaltSync(saltRounds, saltRounds + saltRounds + saltRounds + password);
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    let passwordHash = bcrypt.hashSync(password, salt); //  Hash le mot de passe avec le sel
    const confirmationUrl = `http://localhost:8080/confirm-email?token=${token}`;
    try {
      if(await requete.setUser(username, passwordHash, email, salt, confirmationUrl))
      {
        console.log('on essaye sgMail');
        sgMail.setApiKey('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');

        const confirmationEmail = {
          to: email,
          from: 'e.sport.tournois@gmail.com',
          subject: 'Confirmation d\'inscription',
          text: `Cliquez sur ce lien pour confirmer votre adresse e-mail : ${confirmationUrl}`,
        };

        await sgMail.send(confirmationEmail);
      }
      
      //const token = jwt.sign({ username }, 'secret');
      response.status(200).json({ status: 'success', message: 'Inscription envoyées avec succès' });

    } catch (error) {
      response.status(500).send('Erreur de connexion à la base de données');
    }
  } else {
    response.status(401).send('Erreur entrer un Pseudo, une adresse mail et un mot de passe correct');
  }
}

export async function confirmMail (req, res) {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Token invalide');
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    await requete.confirmUser(email);
    return res.status(200).send('Compte confirmé avec succès');
  } catch (error) {
    console.error(error);
    return res.status(400).send('Token invalide');
  }
}