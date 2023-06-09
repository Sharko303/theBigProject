import bcrypt from 'bcryptjs';
import { createModel, getConnection } from './model.js'

// Ici je crée un modèle lambda
// Le paramètre c'est le nom de table
// Du coup j'ai accès aux fonctions par défaut : get, getAll, create, update, delete
const model = createModel('Users')

// J'exporte mon modèle
export default {
  ...model,

  // Je peux remplecer des fonctions existante
  create: async function (entity) {
    entity.password = await bcrypt.hash(entity.password, 10)
    // Et même les réutiliser pour pas recopier du code
    return model.create(entity)
  },

  alreadyUsed : async function (username, email) {
    let result;
    const conn = await getConnection();
    try {
            const rows = await conn.query(`SELECT * FROM Users WHERE username LIKE '${username}' OR email LIKE '${email}'`);
            if (rows.length > 0) {
                    result = true;
                    console.log("existe");
            } else {
                    result = false;
                    console.log("existe pas ")
            }
    } catch (err) {
            console.error("Erreur lors de l'exécution de la requête SELECT:", err);
            throw err;
    }
    return result
}
}