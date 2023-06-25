import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import userController from './controllers/users.js';
import eventController from './controllers/events.js';
import userModel from './models/user.js';

// Importation des modules et des dépendances
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3002;

// Configuration de l'application
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Middleware CORS pour autoriser les requêtes depuis n'importe quelle origine avec prise en charge des cookies
app.use('/ws', cors({
  origin(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// Middleware pour gérer l'authentification des utilisateurs
app.use('/ws', async (req, res, next) => {
  // Vérification des routes sans authentification
  if (req.method === 'POST' && (req.path === '/users' || req.path === '/users/login' || req.path === '/users/confirm')) {
    next();
    return;
  }

  // Vérification du token d'authentification
  const token = req.cookies?.Authentification;
  if (token) {
    req.user = (await userModel.getBy({ token }))[0];
    if (req.user) {
      next();
      return;
    }
  }

  // Réponse d'erreur pour les requêtes non authentifiées
  res.status(401).json({ message: 'Vous devez être identifié' });
});

// Routes
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

// Démarrage du serveur
app.listen(PORT, () => console.log(`Le serveur est lancé sur le port ${PORT}`));
