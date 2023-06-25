import { createModel } from './model.js'

const modelEvent = createModel('Events')

const participantModel = createModel('Participants')

export default {
  ...modelEvent,
  get: async function (id) {
    // Récupération d'un événement par son ID en utilisant la fonction "get" du modèle d'événement
    const event = await modelEvent.get(id);

    if (event == false) {
      // Si l'événement n'est pas trouvé, renvoyer la valeur "false"
      return false;
    }

    // Récupération des IDs des utilisateurs participants à l'événement en utilisant le modèle de participant
    event.user_ids = (await participantModel.getBy({ event_id: id })).map(row => row.user_id);

    console.log(event);
    // Renvoi de l'événement avec les IDs des utilisateurs participants
    return event;
  },

  getAll: async function () {
    // Récupération de tous les événements en utilisant la fonction "getAll" du modèle d'événement
    const events = await modelEvent.getAll();

    if (events.length == 0) {
      // Si aucun événement n'est trouvé, renvoyer un tableau vide
      return [];
    }

    // Récupération de tous les participants en utilisant le modèle de participant
    const participants = await participantModel.getAll();

    events.forEach(event => {
      // Pour chaque événement, assigner les IDs des utilisateurs participants à la propriété "user_ids"
      event.user_ids = participants.filter((participant) => participant.event_id === event.id).map(row => row.user_id);
    });

    // Renvoi de tous les événements avec les IDs des utilisateurs participants
    return events;
  },

  join: async function (participants) {
    // Création de participants en utilisant le modèle de participant
    return await participantModel.create(participants);
  }

}