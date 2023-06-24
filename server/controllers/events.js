import { handleError, createController } from './controller.js'
// J'importe le model qui va bien
import participantModel from '../models/participant.js'
import matchModel from '../models/match.js'
import model from '../models/user.js'
import modelEvent from '../models/event.js'
/* const participantModel = createModel('Participants') */
import schedule from 'node-schedule';

const controller = createController(modelEvent)
const controllerParticipant = createController(participantModel)
const self = this;

// asOne passe event rejoindre ou créer
async function hasWon(match) {
    console.log("on est dedans")
    try {
        let winner
        console.log(match.fk_user1_id, match.fk_user2_id, 'userid')
        console.log(match.score1_player1, match.score2_player1, 'score')

        if (match.score1_player1 > match.score2_player1) {
            winner = match.fk_user1_id;
        } else {
            winner = match.fk_user2_id;
        }
        
        const step = match.step + 1; // Obtenir l'étape actuelle

        // Vérifier s'il existe un match existant à l'étape suivante
        let nextAvailableMatch = (await matchModel.getBy({ fk_events_id: match.fk_events_id, step, fk_user2_id: null }))[0];
        console.log(nextAvailableMatch, "nextAvailableMatch")
        if (nextAvailableMatch) {
            // Ajouter le gagnant et passer au prochain match existant
            await matchModel.update(nextAvailableMatch.id, {
                fk_user2_id: winner
            });
        } else {
            // Créer un nouveau match à l'étape suivante avec le gagnant comme joueur 1
            console.log(winner,'winner')
            await matchModel.create({
                fk_events_id: match.fk_events_id,
                step,
                fk_user1_id: winner
            });
            
        }
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
// J'exporte mon modèle
async function start(event_id) {
    try {
        const event = await modelEvent.get(event_id);
        const participants = event.user_ids
        console.log("participants :", participants)
        if (participants.length > 1) {

            //const colone = ['fk_user1_id', 'fk_user2_id', 'fk_events_id', 'score_player1', 'score_player2', 'score_confirmed'];
            const matches = [];
            const match = {
                fk_user1_id: null,
                fk_user2_id: null,
                fk_events_id: event_id,
                score_confirmed: 0,
                step: 0
            };

            const participantsCount = participants.length;
            const pairCount = participantsCount / 2;
            const participantsShuffle = shuffle(participants)
            console.log(participantsShuffle)
            for (let i = 0; i < pairCount; i++) {
                console.log(i, i + pairCount, participantsCount);
                match.fk_user1_id = participants[i];
                match.fk_user2_id = participants[i + pairCount];

                /* const values = [fkUser1Id, fkUser2Id, event_id, 0, 0, 0]; */
                const newMatch = await matchModel.create(match);
                matches.push(newMatch);
            }


            console.log('Matches créés :', matches);
        } else {
            console.log('pas assez de participants')
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des participants :', error);
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

function matchIsValidated(match) {
    return match.score1_player1 === match.score1_player2 && match.score2_player1 === match.score2_player2 && match.score1_player1 !== null
}

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
        const tournois = await modelEvent.create(req.body);
        console.log("tournois : ", tournois)
        if (tournois) {
            const dateDebut = new Date(event2.date_start); // Date de début du tournoi
            console.log("dateDebut : ", dateDebut)
            // Extraction des composants de l'heure (heures, minutes, secondes)
            const heureDebutComponents = event2.heure.split(':');
            const heures = parseInt(heureDebutComponents[0], 10);
            const minutes = parseInt(heureDebutComponents[1], 10);

            console.log(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes)

            // Combinaison de la date de début et de l'heure de début en une seule valeur
            const scheduleDate = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes);
            const scheduleDateString = scheduleDate.toLocaleString();
            console.log('normalement ça démarre à :', scheduleDateString);
            const reqUser = req.user.id;
            console.log("this :", this)
            schedule.scheduleJob(scheduleDate, async () => {
                try {
                    // Appel de la fonction startTournois avec les paramètres nécessaires
                    console.log('DEBUT DANS SCHEDULE');
                    await start(tournois.id);
                } catch (error) {
                    console.log('Une erreur s\'est produite lors du démarrage du tournoi :', error);
                }
            });
            res.json({ message: "Votre tournois a bien été créer" })
        } else {
            res.status(500).json({ status: 'error', message: "Création impossible" })
        }
    },

    /*     start: async function (req, res) {
            try {
                const event_id = req.body.id
                const getParticipants = await modelEvent.getBy(event_id);
                const matches = [];
                const match = {
                    fk_user1_id: null,
                    fk_user2_id: null,
                    fk_events_id: event_id,
                    score_confirmed: 0,
                    step:0
                };
    
                const participantsCount = getParticipants.length;
                const pairCount = participantsCount / 2;
                const participantsShuffle = shuffle(getParticipants)
                console.log(participantsShuffle)
                for (let i = 0; i < pairCount; i++) {
                    console.log(i, i + pairCount, participantsCount);
                    match.fk_user1_id = getParticipants[i].user_id;
                    match.fk_user2_id = getParticipants[i + pairCount].user_id;
    
                    // const values = [fkUser1Id, fkUser2Id, event_id, 0, 0, 0]; 
                    const newMatch = await modelEvent.create(match);
                    matches.push(newMatch);
                }
    
    
                console.log('Matches créés :', matches);
    
            } catch (error) {
                console.error('Erreur lors de la récupération des participants :', error);
            }
        }, */

    join: async function (req, res) {

        let participant = req.body;
        let user_id = req.user.id
        req.body = {
            user_id: user_id,
            event_id: participant.tournois_id
        }
        const event_id = req.body.event_id
        console.log('Join :', event_id);
        const allParticipants = await participantModel.getBy({ event_id })
        const already = allParticipants.find((participant) => participant.user_id === user_id);
        console.log(already);
        if (already) {
            console.log("ok")
            res.status(422)
        } else {
            console.log("non")
            let join = await controllerParticipant.post(req, res);
        }
    },
    setScore: async function (req, res) {
        /*  
             fk_user1_id: req.body.fk_user1_id,
             fk_user2_id: req.body.fk_user2_id, */
        const id = req.params.id
        console.log('mon id est ', id);

        let match = await matchModel.get(id);
        const score1 = req.body.scoreJoueur1
        const score2 = req.body.scoreJoueur2
        const user_id = req.user.id
        console.log('MATCH', match)
        if (!match) {
            res.status(200).json({ error: 'Le match n existe pas !' });
            return
        }
        const event = await model.get(match.id)
        if (event.date_start > new Date() || event.date_end < new Date()) {
            res.status(200).json({ error: "L'event n'a pas commencé ou est déjà terminé" });
        }
        if (matchIsValidated(match)) {
            res.status(200).json({ error: 'Les 2 scores sont déjà validé' });
            return
        }
        if (score1 === score2) {
            res.status(200).json({ error: 'Match null a refaire !' });
            return
        }

        let confirm = 0

        if (match.fk_user1_id === user_id) {
            if (match.score1_player2 == score1 && match.score2_player2 == score2) {
                confirm = 1
            }
            match = await matchModel.update(id, {
                score1_player1: score1,
                score2_player1: score2,
                score_confirmed: confirm,
            })
        } else if (match.fk_user2_id === user_id) {
            if (match.score1_player1 == score1 && match.score2_player1 == score2) {
                confirm = 1
            }
            match = await matchModel.update(id, {
                score1_player2: score1,
                score2_player2: score2,
                score_confirmed: confirm,
            })
        } else {
            res.status(200).json({ error: 'Vous ne participez pas au match !' });
            return
        }

        // update en BDD
        // si  match invalide succès et BOUM
        if (!matchIsValidated(match)) {
            res.status(200).json({ message: 'Les 2 scores sont différents' });
            return
        }
        // gestion des nouveaux matches et niveaux
        // Trouver le winner
        /* 4 : Si un match de l'étape actuelle a une place libre, le winner la prend et le match monte d'une step
        6 : Sinon, i un match de l'étape suivant a une place libre, le winner la prend 
        7 : Sinon, vous créez un nouveau match à l'étape +1 et y placez l'user logué en player1
        8 : Sauvegardez tou ça et envoyez un succès */
        const newMatch = await hasWon(match)
        console.log("ok", newMatch)
    },

    get: async function (req, res) {
        try {
            const event = await modelEvent.get(req.params.id)
            const matchs = await matchModel.getEagerByEvent(req.params.id);
            event.matchs = matchs.map(m => ({
                ...m,
                user1_id: undefined,
                user1_username: undefined,
                user2_id: undefined,
                user2_username: undefined,
                users: [
                    {
                        id: m.user1_id,
                        username: m.user1_username
                    },
                    {
                        id: m.user2_id,
                        username: m.user2_username
                    }
                ]
            }))
            /*  let names = Array()
             let id
             for (let index = 0; index < entity.user_ids.length; index++) {
                 id = entity.user_ids[index]
                 names.push((await model.get(id)).username)
             } */
            if (event) {
                res.status(200).json(event)
            } else {
                res.status(404).json(`${modelEvent._table} with id: ${req.params.id} not found`)
            }
        } catch (err) {
            handleError(err, res)
        }
    },
}