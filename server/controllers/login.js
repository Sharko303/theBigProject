import * as requete from '../models/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export function identification(request, response) {
  console.log(request.body);
  console.log(request?.body?.username);
  console.log(request?.body?.password);
  let username = request?.body.username;
  let password = request?.body.password;
  let passwordHash;

  requete.getSalt(username, (error, salt) => {
    if (error) {
      console.error(error);
      response.status(500).send('Erreur de connexion à la base de données');
    } else {
      passwordHash = bcrypt.hashSync(password, salt); //  Hash le mot de passe avec le sel
      console.log("password hash :", passwordHash)
      console.log(salt);

      if (username && passwordHash) {
        requete.getUser(username, passwordHash, (error, results) => {
          if (error) {
            console.error(error);
            response.status(500).send('Erreur de connexion à la base de données');
          } else {
            if (results.length > 0) {
              console.log('Identifiants valides');
              const token = jwt.sign({ username }, 'secret');
              response.status(200).json({ status: 'success', message: 'Données envoyées avec succès', token });
            } else {
              console.log('Identifiants invalides');
              response.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe invalide' });
            }
          }
        });
      } else {
        response.status(401).json({ status: 'error', message: 'Entrez un nom de compte et un mot de passe !' });
      }
    }
  });
}

export function inscription(request, response) {
  console.log("On est dans la function inscription");
  console.log(request?.body?.username);
  console.log(request?.body?.password);
  console.log(request?.body?.email);

  let username = request?.body?.username;
  let password = request?.body?.password;
  let email = request?.body?.email;
  const secretKey = crypto.randomBytes(64).toString('hex');

  const saltRounds = 10 // nombre de fois que le mot de passe sera hashé
  const salt = bcrypt.genSaltSync(saltRounds, saltRounds + saltRounds + saltRounds + password)
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  let passwordHash = bcrypt.hashSync(password, salt); //  Hash le mot de passe avec le sel
  const confirmationUrl = `http://localhost:8080/confirm-email?token=${token}`;

  let newUser = requete.setUser(username, passwordHash, email, salt, confirmationUrl, (error, results) => {
    if (error) {
      console.error(error);
      response.status(500).send('Erreur de connexion à la base de données');
    } else {
      if (results.length > 0) {
        console.log('Identifiants valides');
        const token = jwt.sign({ username }, 'secret');
        response.status(200).json({ status: 'success', message: 'Inscription envoyées avec succès' });
      } else {
        console.log('Identifiants invalides');
        response.status(401).json({ status: 'error', message: 'Inscription non effectué' });
      }
    }
  });


}