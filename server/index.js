import * as loginController from './controllers/login.js';
import * as tournoisController from './controllers/tournois.js';
import express from 'express';
// import cors from 'cors';
import proxy from 'express-http-proxy';
//let history = require('connect-history-api-fallback')
import cors from 'cors';

const app = express();
app.use(express.json());
//app.use(history());
const PORT = process.env.PORT || 3002;

//app.use('/', proxy('http://192.168.8.155:3000'))
app.use(express.static('public'))

//app.use('/ws', cors());
app.use('/ws', (req, res, next) => {
  const origin = req.headers.origin;
  res.set({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, *",
  })
  next();
  });
// Requête connexion et inscription 
app.post('/ws/validatePassword', loginController.identification);
app.post('/ws/inscription', loginController.inscription);

//Requête création de tournois
app.post('/ws/creertournois', tournoisController.creerTournois);
app.post('/ws/rejoindretournois', tournoisController.rejoindreTournois);



/* app.use('/', proxy('http://127.0.0.1:3000', {
  filter: function(req, res) {
    if (req.url.startsWith('/ws')) {
      // Si l'URL commence par "/ws", on ne redirige pas la requête
      return false;
    } else {
      // Sinon, on redirige la requête vers http://127.0.0.1:3000
      return true;
    }
  }
})); */

app.get('/ws/confirm-email', loginController.confirmMail);

app.get('/ws/getTournois', tournoisController.listeTournois);
app.get('/ws/users/:userId', loginController.getUserById);

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`));



//app.get('*', (req, res) => res.redirect('http://localhost:3000'));