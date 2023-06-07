import db from './connexionbdd.js';

export async function create(event) {
        try {
                console.log("Informations :", event);
                const conn = await db;
                const query = `INSERT INTO Events (name, game, user_creator, nb_users, date_start, date_stop,heure, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
                const params = [event.nom, event.game, event.user_creator, 16, event.date_start, event.date_end, event.heure, event.dateAjout];
                const result = await conn.query(query, params);
                const insertId = result.insertId.toString(); // Convertir le BigInt en chaîne de caractères
                const numberId = parseInt(insertId);
                console.log(numberId);
                return getTournament(numberId);
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


export async function getTournament(id) {
        try {
                const conn = await db;
                const rows = await conn.query(`SELECT * FROM Events WHERE event_id LIKE '${id}'`);
                if (rows.length > 0) {
                        return rows
                } else {
                        throw new Error("Aucun tournois trouvé avec cette id.");
                }
        } catch (error) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw error;
        }
}

export async function updateData(table, colonne, values, critere) {
        try {
                const conn = await db; // Obtenez la connexion à la base de données
            
                // Créez la requête dynamiquement en utilisant les paramètres
                const query = `INSERT INTO ${table} (${colonne.join(', ')}) VALUES (${values.map(() => '?').join(', ')}) WHERE ;`;
            
                const result = await conn.query(query, values); // Exécutez la requête avec les valeurs
            
                return result;
              } catch (error) {
                // Gérez les erreurs de manière appropriée
                console.error('Erreur lors de l\'insertion des données:', error);
                throw error;
              }
}
