import * as requete from '../models/auth.js'
import * as event from '../models/event.js'
import { getCookie } from './login.js';
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
    console.error(error);
    response.status(500).json({ message: 'Erreur serveur' });
  }
}

export async function listeTournois(request, response) {
  try {
    let authorisation = request.headers.authorization?.split(' ')[1];
    const cookie = await getCookie(authorisation, 'Authentification')
    let userInfo = await requete.getUserInfo(cookie)
    const user_id = userInfo.user_id
    let tournois = await event.getAllTournois();
    let reqTournoisInscrit = await requete.getData('event_id', 'Participants', 'user_id', user_id);
    let tournoisInscrit = Array();
    for (let i = 0; i < reqTournoisInscrit.length; i++) {
      tournoisInscrit[i] = reqTournoisInscrit[i].event_id;
    }
    console.log(tournoisInscrit);
    for (let i = 0; i < tournois.length; i++) {
      tournois[i].user_creator = await requete.getUserById(tournois[i].user_creator);
    }
    //let tournoisInscrit = await requete.getData('event_id', 'Participants','')
    response.status(200).json({ status: 'success', message: 'Données récupérer avec succès', tournois, tournoisInscrit });
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois :', error);
    response.status(500).json({ error: 'Erreur serveur lors de la récupération des tournois' });
  }
}
export async function rejoindreTournois(request, response) {
  try {
    let participant = request.body;
    let value = Array()
    let cookie = await getCookie(participant.token, 'Authentification');
    let user_id = await requete.getData('user_id', 'Users', 'token', cookie)
    value[0] = user_id[0].user_id;
    value[1] = participant.tournois_id
    value[2] = 0
    let colone = ['user_id', 'event_id', 'end']
    console.log(value)
    let join = await event.setData('Participants', colone, value);
    response.status(200).json({ status: 'success', message: 'Participant ajouté', participant });
  } catch (error) {
    console.error('Erreur lors de l inscription au tournois :', error);
    response.status(500).json({ error: 'Erreur lors de l inscription au tournois' });
  }
}

