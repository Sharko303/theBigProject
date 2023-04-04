import * as loginController from './controllers/login.js';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3002

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`))

app.post('/login', loginController.identification)