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
    const tournois = await event.create(event);
    console.log(tournois)
    response.status(201).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ status: 'error' });
  }
}

export async function listeTournois(request, response) {
  console.log('ok')
  try {
    let authorisation = request.headers.authorization?.split(' ')[1];
    console.log(authorisation);
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
    response.status(200).json({ status: 'success', message: 'Données récupérer avec succès', tournois, tournoisInscrit });
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois :', error);
    response.status(500).json({ error: 'Erreur serveur lors de la récupération des tournois' });
  }
  //response.status(200).json({ status: 'success', message: 'Données récupérer avec succès', tournois, tournoisInscrit });
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

export async function tableauParticipant(request, response) {
  try {
    // Route pour récupérer les participants inscrits
    // Code pour récupérer les participants depuis la base de données
    // ...
    const id_tournois = request.params.numTournois;
    const participants = await requete.getData('*', 'Participants', 'event_id', id_tournois);
    const participantIds = participants.map(participant => participant.user_id);
    console.log(participantIds)
    const participantName = await requete.getDatas('*', 'Users', 'user_id', participantIds);
    const participantNames = participantName.map(participant => participant.username);

    console.log(participantNames)
    console.log(participantIds)
    response.status(200).json({ status: 'success', message: 'Participant récupéré', participantIds, participantNames });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    response.status(500).json({ error: 'Erreur serveur lors de la récupération des participants' });
  }
}