import db from './connexionbdd.js';

export async function createTournament(nom, game, username, date_start, date_stop, heure) {
        try {
                const dateAjout = new Date()
                console.log("Informations :",nom, game, username, date_start, date_stop, heure)
                const conn = await db;
                const query = `INSERT INTO Events (name, game, user_creator, nb_users, date_start, date_stop, create_date) VALUES (?, ?, ?, ?, ?, ?, ?);`;
                const params = [nom, game, username, 16, date_start, date_stop, dateAjout ];
                const result = await conn.query(query, params);
                return result;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête INSERT:", err);
                throw err;
        }
}
