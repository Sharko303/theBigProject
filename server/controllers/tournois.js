import * as requete from '../models/auth.js'
import * as event from '../models/event.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'


//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
export async function creerTournois(request, response) {
  try {
    const { nom, game, date_start, date_end, heure, token } = request.body;

    let reqUser = await requete.getUserInfo(token)
    let username = reqUser.user_id;
    const tournois = await event.createTournament({
      nom,
      game,
      username,
      date_start,
      date_end,
      heure,
      
    });
    
    response.status(201).json({ tournois });
  } catch (error) {
    console.log('test')
    console.error(error);
    response.status(500).json({ message: 'Erreur serveur' });
  }
}

