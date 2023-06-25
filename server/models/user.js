import bcrypt from 'bcryptjs';
import { createModel, getConnection } from './model.js'

// Ici je crée un modèle lambda
// Le paramètre c'est le nom de table
// Du coup j'ai accès aux fonctions par défaut : get, getAll, create, update, delete
const model = createModel('Users')

// J'exporte mon modèle
export default {
  ...model,

    create: async function (entity) {
        // Hachage du mot de passe avant la création de l'entité
        entity.password = await bcrypt.hash(entity.password, 10);

        // Réutilisation de la fonction create existante dans le modèle
        return model.create(entity);
    },

    alreadyUsed: async function (username, email) {
        let result;

        // Établir une connexion à la base de données
        const conn = await getConnection();

        try {
            // Exécuter une requête pour vérifier si le nom d'utilisateur ou l'email est déjà utilisé
            const rows = await conn.query(`SELECT * FROM Users WHERE username LIKE '${username}' OR email LIKE '${email}'`);

            if (rows.length > 0) {
                // Si des résultats sont trouvés, cela signifie que le nom d'utilisateur ou l'email est déjà utilisé
                result = true;
                console.log("existe");
            } else {
                // Sinon, cela signifie que le nom d'utilisateur et l'email ne sont pas déjà utilisés
                result = false;
                console.log("existe pas ");
            }
        } catch (err) {
            console.error("Erreur lors de l'exécution de la requête SELECT:", err);
            throw err;
        }

        return result;
    }

}