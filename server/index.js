
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Le serveur est lancer sur le port ${PORT}`))

