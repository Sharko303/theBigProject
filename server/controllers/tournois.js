import * as requete from '../models/auth.js'
import * as event from '../models/event.js'
import { getCookie } from './login.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail'
import schedule from 'node-schedule';


//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
export async function creerTournois(request, response) {
  try {
    const event2 = request.body;
    let cookie = await getCookie(event2.token, 'Authentification')
    let reqUser = await requete.getUserInfo(cookie)
    console.log("username" + reqUser.user_id)
    event2.user_creator = reqUser.user_id;
    //console.log(info)
    event2.date_start = event2.date_start.slice(0, 10)
    event2.date_end = event2.date_end.slice(0, 10)
    let dateAjout = new Date()
    dateAjout = dateAjout.toISOString().slice(0, 19)
    event2.dateAjout = dateAjout
    const tournois = await event.create(event2);
    console.log(tournois)
    if (tournois) {
      const dateDebut = new Date(event2.date_start); // Date de début du tournoi
      console.log(dateDebut)
      // Extraction des composants de l'heure (heures, minutes, secondes)
      const heureDebutComponents = event2.heure.split(':');
      const heures = parseInt(heureDebutComponents[0], 10);
      const minutes = parseInt(heureDebutComponents[1], 10);

      console.log(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes)

      // Combinaison de la date de début et de l'heure de début en une seule valeur
      const scheduleDate = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes);
      console.log(scheduleDate);
      schedule.scheduleJob(scheduleDate, async () => {
        try {
          // Appel de la fonction startTournois avec les paramètres nécessaires
          let date = new Date();
          console.log('Coucou mes loulous', reqUser);
          console.log('tournois',tournois[0].event_id)
          await startTournois(tournois[0].event_id);
        } catch (error) {
          console.log('Une erreur s\'est produite lors du démarrage du tournoi :', error);
        }
      });
    }
    //console.log(tournois)
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
    const id_tournois = request.params.numTournois;
    const participants = await requete.getData('*', 'Matches', 'fk_events_id', id_tournois);
    const matches = participants.map(participant => ({
      joueur1: participant.fk_user1_id,
      joueur2: participant.fk_user2_id
    }));

    const participantIds = matches.flatMap(pair => [pair.joueur1, pair.joueur2]);

    const participantName = await requete.getDatas('*', 'Users', 'user_id', participantIds);

    const getParticipantName = (participantId) => {
      const participant = participantName.find(p => p.user_id === participantId);
      return participant ? participant.username : '';
    };

    const participantNames = matches.map(pair => ({
      joueur1: getParticipantName(pair.joueur1),
      joueur2: getParticipantName(pair.joueur2)
    }));
    console.log(participantNames)
    response.status(200).json({ status: 'success', message: 'Participants récupérés', matches, participantNames });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
    response.status(500).json({ error: 'Erreur serveur lors de la récupération des participants' });
  }
}

export async function startTournois(event_id, request, response) {
  try {
    const getParticipants = await requete.getData('user_id', 'Participants', 'event_id', event_id);
    console.log(getParticipants);

    const colone = ['fk_user1_id', 'fk_user2_id', 'fk_events_id', 'score_player1', 'score_player2', 'score_confirmed'];
    const matches = [];

    const participantsCount = getParticipants.length;
    const pairCount = participantsCount / 2;
    const participantsShuffle = shuffle(getParticipants)
    console.log(participantsShuffle)
     for (let i = 0; i < pairCount; i++) {
      console.log(i, i + pairCount, participantsCount);
      const fkUser1Id = getParticipants[i].user_id;
      const fkUser2Id = getParticipants[i + pairCount].user_id;

      const values = [fkUser1Id, fkUser2Id, event_id, 0, 0, 0];
      const newMatch = await event.setData('Matches', colone, values);
      matches.push(newMatch);
    } 
    

    console.log('Matches créés :', matches);

  } catch (error) {
    console.error('Erreur lors de la récupération des participants :', error);
  }
}

export async function genererMatches(request, response, heure) {
  const eventId = requete.getData()
  const heureChoisie = req.params.heureChoisie;

  try {
    const result = await matchModel.genererMatches(eventId, heureChoisie);
    response.status(200).json({ message: 'Matches créés et stockés avec succès.' });
  } catch (error) {
    console.log('Une erreur s\'est produite lors de la génération des matches :', error);
    response.status(500).json({ error: 'Une erreur s\'est produite lors de la génération des matches.' });
  }
}
export async function getHeuresDebutTournois(request, response, heure) {
  const eventId = requete.getData()
  const heureChoisie = req.params.heureChoisie;

  try {
    const result = await matchModel.genererMatches(eventId, heureChoisie);
    res.status(200).json({ message: 'Matches créés et stockés avec succès.' });
  } catch (error) {
    console.log('Une erreur s\'est produite lors de la génération des matches :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la génération des matches.' });
  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export async function addScore(request, response) {
  const eventId = requete.getData()
  const heureChoisie = req.params.heureChoisie;

  try {
    const result = 'requete';
    response.status(200).json({ message: 'Matches créés et stockés avec succès.' });
  } catch (error) {
    console.log('Une erreur s\'est produite lors de la génération des matches :', error);
    response.status(500).json({ error: 'Une erreur s\'est produite lors de la génération des matches.' });
  }
}