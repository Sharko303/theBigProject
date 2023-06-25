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

// asOne passe event rejoindre ou créer
/**
 * Vérifie si un joueur a remporté le match
 * @param {object} match - Objet représentant le match
 * @returns {boolean} - Indique si le joueur a remporté le match avec succès
 */
async function hasWon(match) {
    console.log("on est dedans"); // Affiche un message dans la console
    try {
        let winner; // Variable pour stocker le gagnant du match

        if (match.score1_player1 > match.score2_player1) { // Vérifie si le score du joueur 1 est supérieur au score du joueur 2
            winner = match.fk_user1_id; // Le gagnant est le joueur 1
        } else {
            winner = match.fk_user2_id; // Le gagnant est le joueur 2
        }

        const step = match.step + 1; // Obtenir l'étape actuelle du match

        // Vérifier s'il existe un match existant à l'étape suivante
        let nextAvailableMatch = (await matchModel.getBy({ fk_events_id: match.fk_events_id, step, fk_user2_id: null }))[0];
        if (nextAvailableMatch) {
            // Ajouter le gagnant au match existant et passer au prochain match existant
            await matchModel.update(nextAvailableMatch.id, {
                fk_user2_id: winner
            });
        } else {
            // Créer un nouveau match à l'étape suivante avec le gagnant comme joueur 1
            await matchModel.create({
                fk_events_id: match.fk_events_id,
                step,
                fk_user1_id: winner
            });
        }
        return true; // Indique que le joueur a remporté le match avec succès
    } catch (error) {
        return false; // Indique qu'il y a eu une erreur lors du traitement du match
    }
}
// J'exporte mon modèle
/**
 * Démarre le tournoi en créant les matchs initiaux
 * @param {string} event_id - ID de l'événement
 */
async function start(event_id) {
    try {
        const event = await modelEvent.get(event_id); // Récupère les détails de l'événement avec l'ID spécifié
        const participants = event.user_ids; // Récupère les participants à l'événement
        if (participants.length > 1) { // Vérifie s'il y a plus d'un participant

           const matches = []; // Tableau pour stocker les matches créés
            const match = {
                fk_user1_id: null,
                fk_user2_id: null,
                fk_events_id: event_id,
                score_confirmed: 0,
                step: 0
            }; // Objet représentant les détails d'un match

            const participantsCount = participants.length;
            const pairCount = participantsCount / 2;
            const participantsShuffle = shuffle(participants); // Mélange aléatoirement les participants

            for (let i = 0; i < pairCount; i++) {
                match.fk_user1_id = participants[i];
                match.fk_user2_id = participants[i + pairCount];

                /* const values = [fkUser1Id, fkUser2Id, event_id, 0, 0, 0]; */
                const newMatch = await matchModel.create(match); // Crée un nouveau match avec les détails spécifiés
                matches.push(newMatch); // Ajoute le nouveau match au tableau des matches
            }

        } else {
            return; // Il n'y a qu'un seul participant, on arrête la fonction
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des participants :', error); // Affiche une erreur en cas de problème lors de la récupération des participants
    }
}


/**
 * Mélange un tableau d'éléments de manière aléatoire
 * @param {array} array - Tableau à mélanger
 * @returns {array} - Tableau mélangé
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // Tant qu'il reste des éléments à mélanger.
    while (currentIndex != 0) {

        // Choisis un élément restant.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Et on échange avec l'élément courant.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Vérifie si le match a été validé avec des scores corrects
 * @param {object} match - Objet représentant le match
 * @returns {boolean} - Indique si le match a été validé
 */
function matchIsValidated(match) {
    // Vérifier si le score du joueur 1 dans le match est égal au score du joueur 2
    // et si le score du joueur 1 et du joueur 2 n'est pas nul
    return match.score1_player1 === match.score1_player2 && match.score2_player1 === match.score2_player2 && match.score1_player1 !== null
}

export default {
    ...controller,

    /**
     * Crée un nouvel événement
     * @param {object} req - Requête HTTP
     * @param {object} res - Réponse HTTP
     */
    post: async function (req, res) {
        // Récupération des données de l'événement depuis la requête
        const event2 = req.body;

        // Attribution de l'ID de l'utilisateur créateur de l'événement
        event2.user_creator = req.user.id;

        // Extraction de la date de début et de fin de l'événement
        event2.date_start = event2.date_start.slice(0, 10);
        event2.date_stop = event2.date_stop.slice(0, 10);

        // Obtention de la date actuelle
        let dateAjout = new Date();
        dateAjout = dateAjout.toISOString().slice(0, 19);

        // Attribution de la date d'ajout à l'événement
        event2.dateAjout = dateAjout;

        // Création de l'objet de requête avec les données nécessaires
        req.body = {
            name: event2.name,
            game: event2.game,
            user_creator: event2.user_creator,
            nb_users: 16,
            date_start: event2.date_start,
            date_stop: event2.date_stop,
            heure: event2.heure,
            create_date: new Date()
        };

        // Création de l'événement dans la base de données
        const tournois = await modelEvent.create(req.body);
        console.log("tournois : ", tournois);

        if (tournois) {
            const dateDebut = new Date(event2.date_start); // Date de début du tournoi
            console.log("dateDebut : ", dateDebut);

            // Extraction des composants de l'heure (heures, minutes, secondes)
            const heureDebutComponents = event2.heure.split(':');
            const heures = parseInt(heureDebutComponents[0], 10);
            const minutes = parseInt(heureDebutComponents[1], 10);

            console.log(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes);

            // Combinaison de la date de début et de l'heure de début en une seule valeur
            const scheduleDate = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate(), heures, minutes);
            const scheduleDateString = scheduleDate.toLocaleString();
            console.log('normalement ça démarre à :', scheduleDateString);

            const reqUser = req.user.id;
            console.log("this :", this);

            // Planification de l'exécution de la fonction startTournois à la date de début de l'événement
            schedule.scheduleJob(scheduleDate, async () => {
                try {
                    // Appel de la fonction start avec l'ID de l'événement
                    console.log('DEBUT DANS SCHEDULE');
                    await start(tournois.id);
                } catch (error) {
                    console.log('Une erreur s\'est produite lors du démarrage du tournoi :', error);
                }
            });

            // Réponse JSON indiquant que l'événement a été créé avec succès
            res.json({ message: "Votre tournoi a bien été créé" });
        } else {
            // Réponse JSON indiquant une erreur de création
            res.status(500).json({ status: 'error', message: "Création impossible" });
        }
    },

    /**
     * Rejoint un événement en tant que participant
     * @param {object} req - Requête HTTP
     * @param {object} res - Réponse HTTP
     */
    join: async function (req, res) {
        // Récupération des données du participant depuis la requête
        let participant = req.body;
        let user_id = req.user.id;

        // Création de l'objet de requête avec les données nécessaires
        req.body = {
            user_id: user_id,
            event_id: participant.tournois_id
        };

        const event_id = req.body.event_id;
        console.log('Join :', event_id);

        // Récupération de tous les participants de l'événement
        const allParticipants = await participantModel.getBy({ event_id });

        // Vérification si l'utilisateur est déjà inscrit à l'événement
        const already = allParticipants.find((participant) => participant.user_id === user_id);
        console.log(already);

        if (already) {
            console.log("ok");
            res.status(422);
        } else {
            console.log("non");

            // Appel de la fonction de création d'un participant
            let join = await controllerParticipant.post(req, res);
        }
    },

    /**
     * Enregistre le score d'un match
     * @param {object} req - Requête HTTP
     * @param {object} res - Réponse HTTP
     */
    setScore: async function (req, res) {
        const id = req.params.id;

        // Récupération du match à partir de l'ID fourni
        let match = await matchModel.get(id);
        const score1 = req.body.scoreJoueur1;
        const score2 = req.body.scoreJoueur2;
        const user_id = req.user.id;

        if (!match) {
            res.status(200).json({ error: 'Le match n\'existe pas !' });
            return;
        }

        // Récupération de l'événement associé au match
        const event = await model.get(match.id);

        // Vérification si l'événement a commencé ou est déjà terminé
        if (event.date_start > new Date() || event.date_end < new Date()) {
            res.status(200).json({ error: "L'événement n'a pas commencé ou est déjà terminé" });
            return;
        }

        // Vérification si les scores du match sont déjà validés
        if (matchIsValidated(match)) {
            res.status(200).json({ error: 'Les 2 scores sont déjà validés' });
            return;
        }

        // Vérification si le score est nul (égalité)
        if (score1 === score2) {
            res.status(200).json({ error: 'Match nul, à refaire !' });
            return;
        }

        let confirm = 0;

        // Vérification du joueur et mise à jour des scores et de la confirmation
        if (match.fk_user1_id === user_id) {
            if (match.score1_player2 == score1 && match.score2_player2 == score2) {
                confirm = 1;
            }
            match = await matchModel.update(id, {
                score1_player1: score1,
                score2_player1: score2,
                score_confirmed: confirm,
            });
        } else if (match.fk_user2_id === user_id) {
            if (match.score1_player1 == score1 && match.score2_player1 == score2) {
                confirm = 1;
            }
            match = await matchModel.update(id, {
                score1_player2: score1,
                score2_player2: score2,
                score_confirmed: confirm,
            });
        } else {
            res.status(200).json({ error: 'Vous ne participez pas au match !' });
            return;
        }

        // Mise à jour en base de données
        // Si le match est invalide, renvoyer un message d'erreur
        if (!matchIsValidated(match)) {
            res.status(200).json({ message: 'Les 2 scores sont différents' });
            return;
        }

        // Appel de la fonction hasWon pour vérifier si le joueur a gagné
        const newMatch = await hasWon(match);
    },

    /**
     * Récupère les détails d'un événement (on surcharge notre fonction générique get)
     * @param {object} req - Requête HTTP
     * @param {object} res - Réponse HTTP
     */
    get: async function (req, res) {
        try {
            // Récupération de l'événement à partir de l'ID fourni
            const event = await modelEvent.get(req.params.id);

            // Récupération des matchs associés à l'événement en utilisant eager loading
            const matchs = await matchModel.getEagerByEvent(req.params.id);

            // Mise à jour de l'objet event avec les matchs et les utilisateurs associés
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
            }));

            if (event) {
                res.status(200).json(event);
            } else {
                res.status(404).json(`${modelEvent._table} with id: ${req.params.id} not found`);
            }
        } catch (err) {
            handleError(err, res);
        }
    }

}