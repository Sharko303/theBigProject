import { createModel } from './model.js'
import { getConnection } from './model.js'
const matchModel = createModel('Matches')

export default {

  ...matchModel,

  getEagerByEvent: async function(id) {
    // Établir une connexion à la base de données
    const conn = await getConnection();
    try {
      // Requête SQL pour récupérer les matchs avec les utilisateurs associés
      const query = `
            SELECT m.*, u1.id as user1_id, u1.username as user1_username, u2.id as user2_id, u2.username as user2_username
            FROM matches m
            LEFT JOIN users u1 ON m.fk_user1_id = u1.id
            LEFT JOIN users u2 ON m.fk_user2_id = u2.id
            WHERE m.fk_events_id = ?;
        `;

      // Exécuter la requête SQL en utilisant l'ID de l'événement en tant que paramètre
      const matchs = await conn.query(query, [id]);

      console.log(matchs);
      // Renvoyer les matchs récupérés avec les utilisateurs associés
      return matchs;
    } catch (error) {
      throw error;
    }
  }
}