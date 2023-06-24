import * as loginController from './controllers/login.js';
import * as tournoisController from './controllers/tournois.js';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import cron from 'node-cron'
import * as requete from './models/auth.js'
import userController from './controllers/users.js';
import eventController from './controllers/events.js';
import userModel from './models/user.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(history());
const PORT = process.env.PORT || 3002;

//app.use('/', proxy('http://192.168.8.155:3000'))
app.use(express.static('public'))

app.use('/ws', cors({
  origin(origin, callback) {
      callback(null, true)
  },
  credentials: true
}))

app.use('/ws', async (req, res, next) => {
  if(req.method == 'POST' && req.path == '/users' || req.path == '/users/login' || req.path == '/users/confirm') {
    next()
    return
  }

  const token = req.cookies?.Authentification
  if (token) {
    req.user = (await userModel.getBy({token}))[0]
    if (req.user) {
      next()
      return
    }
  }
  res.status(401).json({message:'Vous devez être identifié'})
});
// Requête connexion et inscription 
/* app.post('/ws/validatePassword', loginController.identification); */
/* app.post('/ws/validatePassword', userController.login); 

app.post('/ws/inscription', loginController.inscription);

//Requête création de tournois
app.post('/ws/creertournois', tournoisController.creerTournois);
app.post('/ws/rejoindretournois', tournoisController.rejoindreTournois); */


app.post('/ws/users/login', userController.login);
app.post('/ws/users/logout', userController.logout);
app.get('/ws/users/confirm', userController.confirmMail); 

app.get('/ws/users/:id', userController.get);
app.post('/ws/users', userController.post);

app.get('/ws/events', eventController.getAll);
app.get('/ws/events/:id', eventController.get);
app.post('/ws/events', eventController.post);
app.post('/ws/events/join', eventController.join);
app.put('/ws/events/match/:id', eventController.setScore);



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


/* app.get('/ws/confirm-email', loginController.confirmMail);

app.get('/ws/tournois/:numTournois', tournoisController.tableauParticipant);
app.get('/ws/getTournois', tournoisController.listeTournois);
app.get('/ws/users/:userId', loginController.getUserById);
 */
/* 
app.get('*', (req, res) => {
// if(), rediriger sur connexion
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); // on redirige toute les routes inconnues vers le fichier index.html pour que React puisse gérer le routage côté client

 */

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`));

// Planification de l'exécution toutes les minutes
/* cron.schedule('* * * * *', async () => {
  const now = new Date();
  const heureActuelle = now.toLocaleTimeString('fr-FR', { hour12: false });

  try {
    const heuresIdDebutTournois = await requete.getData('heure,event_id', 'Events');
    console.log(heuresIdDebutTournois, 'heure debut')
    console.log(heureActuelle)
    if (heuresIdDebutTournois.some(heure => heure.heure === heureActuelle)) {
      const heure = heuresIdDebutTournois.find(item => item.heure === heureActuelle);
      let event_id = heure.event_id
      console.log("On a la même heure");
      await tournoisController.startTournois(heureActuelle,event_id);
    }
  } catch (error) {
    console.log('Une erreur s\'est produite lors de la récupération des heures de début des tournois :', error);
  }
}); */

//app.get('*', (req, res) => res.redirect('http://localhost:3000'));