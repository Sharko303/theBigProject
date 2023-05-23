import * as loginController from './controllers/login.js';
import * as tournoisController from './controllers/tournois.js';
import express from 'express';
// import cors from 'cors';
import proxy from 'express-http-proxy'
//let history = require('connect-history-api-fallback')

const app = express();
app.use(express.json());
//app.use(cors());
//app.use(history());
const PORT = process.env.PORT || 8080;

//app.use('/', proxy('http://192.168.8.155:3000'))

// Requête connexion et inscription 
app.post('/ws/validatePassword', loginController.identification);
app.post('/ws/inscription', loginController.inscription);

//Requête création de tournois
app.post('/ws/creertournois', tournoisController.creerTournois);
app.post('/ws/rejoindretournois', tournoisController.rejoindreTournois);

app.use('/', proxy('http://127.0.0.1:3000', {
  filter: function(req, res) {
    if (req.url.startsWith('/ws')) {
      // Si l'URL commence par "/ws", on ne redirige pas la requête
      return false;
    } else {
      // Sinon, on redirige la requête vers http://127.0.0.1:3000
      return true;
    }
  }
}));

app.get('/ws/confirm-email', loginController.confirmMail);

app.get('/ws/getTournois', tournoisController.listeTournois);
app.get('/ws/users/:userId', loginController.getUserById);

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`));



//app.get('*', (req, res) => res.redirect('http://localhost:3000'));