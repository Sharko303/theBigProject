import mariadb from 'mariadb'
export function getConnection() {
  return mariadb.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
}

export function createModel(table) {

  return {
    get: async function (id) {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Exécuter une requête pour récupérer l'entité par ID
      const res = await conn.query(`SELECT * FROM ${conn.escapeId(table)} WHERE id = ?`, [id]);

      if (res.length == 1) {
        // Si une seule entité est trouvée, la renvoyer
        return res[0];
      } else {
        // Sinon, renvoyer false
        return false;
      }
    },

    getBy: async function (params) {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Construire la condition de recherche en utilisant les paramètres fournis
      const condition = Object.keys(params).map((colName) => `${conn.escapeId(colName)} = ?`).join(' AND ');
      const values = Object.values(params);

      // Exécuter une requête pour récupérer les entités correspondant à la condition
      return await conn.query(`SELECT * FROM ${conn.escapeId(table)} WHERE ${condition}`, values);
    },

    getAll: async function () {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Exécuter une requête pour récupérer toutes les entités
      return await conn.query(`SELECT * FROM ${conn.escapeId(table)}`);
    },

    create: async function (entity) {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Construire les parties de la requête pour l'insertion d'une nouvelle entité
      const colNames = Object.keys(entity).map((col) => conn.escapeId(col)).join(', ');
      const values = Object.values(entity);
      const placeholder = Array(values.length).fill('?').join(', ');

      // Exécuter une requête pour insérer la nouvelle entité
      const res = await conn.query(`INSERT INTO ${conn.escapeId(table)} (${colNames}) VALUES (${placeholder})`, values);

      // Récupérer l'entité nouvellement créée et la renvoyer
      return await this.get(res.insertId);
    },

    update: async function (idOrCond, entity) {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Construire les parties de la requête pour la mise à jour de l'entité
      const setters = Object.keys(entity).map((colName) => `${conn.escapeId(colName)} = ?`).join(', ');
      const values = Object.values(entity);

      let query = `UPDATE ${conn.escapeId(table)} SET ${setters}`;

      if (typeof idOrCond === 'object') {
        // Si l'argument est un objet, construire une condition de recherche basée sur les clés/valeurs fournies
        const conditionKeys = Object.keys(idOrCond);
        const conditionValues = Object.values(idOrCond);
        const conditions = conditionKeys.map((key) => `${conn.escapeId(key)} = ?`).join(' AND ');
        query += ` WHERE ${conditions}`;
        values.push(...conditionValues);
      } else {
        // Sinon, construire une condition de recherche basée sur l'ID
        query += ` WHERE id = ?`;
        values.push(idOrCond);
      }

      // Exécuter la requête de mise à jour
      await conn.query(query, values);

      // Récupérer l'entité mise à jour et la renvoyer
      return await this.get(idOrCond);
    },

    delete: async function (id) {
      // Établir une connexion à la base de données
      const conn = await getConnection();

      // Exécuter une requête pour supprimer l'entité par ID
      const res = await conn.query(`DELETE FROM ${conn.escapeId(table)} WHERE id = ?`, [id]);

      // Vérifier si une ligne a été affectée (supprimée)
      return res.affectedRows == 1;
    }
  }
}