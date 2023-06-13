import { handleError, createController } from './controller.js'
// J'importe le model qui va bien
import participantModel from '../models/participant.js'
import model from '../models/event.js'
/* const participantModel = createModel('Participants') */
import schedule from 'node-schedule';

const controller = createController(model)
 const controllerParticipant = createController(participantModel)

// J'exporte mon modèle
export default {
    ...controller,
/*     ...controllerParticipant, */

    post: async function (req, res) {

        const event2 = req.body;
        event2.user_creator = req.user.id;
        event2.date_start = event2.date_start.slice(0, 10)
        event2.date_stop = event2.date_stop.slice(0, 10)
        let dateAjout = new Date()
        dateAjout = dateAjout.toISOString().slice(0, 19)
        event2.dateAjout = dateAjout
        req.body = {
            name: event2.name,
            game: event2.game,
            user_creator: event2.user_creator,
            nb_users: 16,
            date_start: event2.date_start,
            date_stop: event2.date_stop,
            heure: event2.heure,
            create_date: new Date()
        }
        /* console.log(req.body) */
        const tournois = await model.create(req.body);
        console.log("tournois : ", tournois)
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
            console.log('normalement sa lance a :', scheduleDate);
            const reqUser = req.user.id;
            
            schedule.scheduleJob(scheduleDate, async () => {
                try {
                    // Appel de la fonction startTournois avec les paramètres nécessaires
                    let date = new Date();
                    console.log('Coucou mes loulous', reqUser);
                    console.log('tournois', tournois.event_id)
                    await start(tournois[0].event_id);
                } catch (error) {
                    console.log('Une erreur s\'est produite lors du démarrage du tournoi :', error);
                }
            });
            res.json({message:"Votre tournois a bien été créer"})
        }else {
            response.status(500).json({ status: 'error', message: "Création impossible" })
        }
    },
    start: async function (event_id, request, response) {
        try {

            const getParticipants = await model.getBy(event_id);
            console.log(getParticipants);

            const colone = ['fk_user1_id', 'fk_user2_id', 'fk_events_id', 'score_player1', 'score_player2', 'score_confirmed'];
            const matches = [];
            const match = {
                fk_user1_id: null,
                fk_user2_id: null,
                fk_events_id: event_id,
                score_player1: 0,
                score_player2: 0,
                score_confirmed: 0
            };

            const participantsCount = getParticipants.length;
            const pairCount = participantsCount / 2;
            const participantsShuffle = shuffle(getParticipants)
            console.log(participantsShuffle)
            for (let i = 0; i < pairCount; i++) {
                console.log(i, i + pairCount, participantsCount);
                match.fk_user1_id = getParticipants[i].user_id;
                match.fk_user2_id = getParticipants[i + pairCount].user_id;

                /* const values = [fkUser1Id, fkUser2Id, event_id, 0, 0, 0]; */
                const newMatch = await model.create(match);
                matches.push(newMatch);
            }


            console.log('Matches créés :', matches);

        } catch (error) {
            console.error('Erreur lors de la récupération des participants :', error);
        }
    },

    join: async function (req, res) {

        let participant = req.body;
        let user_id = req.user.id
        req.body = {
            user_id: user_id,
            event_id: participant.tournois_id
        }

        let join = await controllerParticipant.post(req,res); 
        if(join){
            res
        }
    }
}