import db from './connexionbdd.js';

export async function createTournament(nom, game, username, date_start, date_stop, heure) {
        try {
                const dateAjout = new Date()
                console.log("Informations :", nom, game, username, date_start, date_stop, heure)
                const conn = await db;
                const query = `INSERT INTO Events (name, game, user_creator, nb_users, date_start, date_stop, create_date) VALUES (?, ?, ?, ?, ?, ?, ?);`;
                const params = [nom, game, username, 16, date_start, date_stop, dateAjout];
                const result = await conn.query(query, params);
                return result;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête INSERT:", err);
                throw err;
        }
}

export async function getAllTournois() {
        try {
                const conn = await db;
                const rows = await conn.query('SELECT * FROM Events');
                return rows;
        } catch (error) {
                console.error('Erreur lors de la récupération des tournois :', error);
                return [];
        } 
}
/* export async function setParticipant(participant) {
        try {
                console.log("Informations :", nom, game, username, date_start, date_stop, heure)
                const conn = await db;
                const query = `INSERT INTO Participants (name, game, user_creator, nb_users, date_start, date_stop, create_date) VALUES (?, ?, ?, ?, ?, ?, ?);`;
                const params = [nom, game, username, 16, date_start, date_stop, dateAjout];
                const result = await conn.query(query, params);
                return result;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête INSERT:", err);
                throw err;
        }
} */
export async function setData(table, colone, values) {
        try {
                const conn = await db; // Obtenez la connexion à la base de données
            
                // Créez la requête dynamiquement en utilisant les paramètres
                const query = `INSERT INTO ${table} (${colone.join(', ')}) VALUES (${values.map(() => '?').join(', ')});`;
            
                const result = await conn.query(query, values); // Exécutez la requête avec les valeurs
            
                return result;
              } catch (error) {
                // Gérez les erreurs de manière appropriée
                console.error('Erreur lors de l\'insertion des données:', error);
                throw error;
              }
}