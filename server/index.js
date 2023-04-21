import * as loginController from './controllers/login.js';
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

app.post('/ws/validatePassword', loginController.identification);
app.post('/ws/inscription', loginController.inscription);


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

app.get('/confirm-email', loginController.confirmMail);

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`));



//app.get('*', (req, res) => res.redirect('http://localhost:3000'));