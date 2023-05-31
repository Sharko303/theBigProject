import * as loginController from './controllers/login.js';
import * as tournoisController from './controllers/tournois.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron'
import * as requete from './models/auth.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get('/ws/tournois/:numTournois', tournoisController.tableauParticipant);
app.get('/ws/getTournois', tournoisController.listeTournois);
app.get('/ws/users/:userId', loginController.getUserById);

/* 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); // on redirige toute les routes inconnues vers le fichier index.html pour que React puisse gérer le routage côté client
 */

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`));

// Planification de l'exécution toutes les minutes
cron.schedule('* * * * *', async () => {
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
});

//app.get('*', (req, res) => res.redirect('http://localhost:3000'));