import { createModel } from './model.js'
import { getConnection } from './model.js'
const matchModel = createModel('Matches')

export default {

  ...matchModel,

  getEagerByEvent: async function(id) {
    const conn = await getConnection();
    try {
      const query = `
        SELECT m.*, u1.id as user1_id, u1.username as user1_username, u2.id as user2_id, u2.username as user2_username
        FROM matches m
        LEFT JOIN users u1 ON m.fk_user1_id = u1.id
        LEFT JOIN users u2 ON m.fk_user2_id = u2.id
        WHERE m.fk_events_id = ?;
      `;
      const matchs = await conn.query(query, [id]);

      console.log(matchs)
      return matchs;
    } catch (error) {
      throw error;
    }
  }
}