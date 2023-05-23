import * as requete from '../models/auth.js'
<<<<<<< Updated upstream
import * as event from '../models/event.js'
import { getCookie } from './login.js';
=======
import * as Event from '../models/event.js'
>>>>>>> Stashed changes
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'



//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
export async function creerTournois(request, response) {
  try {
<<<<<<< Updated upstream
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
=======
    const event = request.body;
    //console.log(info.token)
    let reqUser = await requete.getUserInfo(event.token)
    //console.log("username" + reqUser.id)
    event.user_creator = reqUser.user_id;
    //console.log(info)
    event.date_start = event.date_start.slice(0, 10)
    event.date_end = event.date_end.slice(0, 10)
    let dateAjout = new Date()
    dateAjout = dateAjout.toISOString().slice(0, 19)
    event.dateAjout = dateAjout
    const tournois = await Event.create(event);
    console.log(tournois)
    response.status(201).json({ status: 'success' });
>>>>>>> Stashed changes
  } catch (error) {
    console.error(error);
    response.status(401).json({ status: 'error' });
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

