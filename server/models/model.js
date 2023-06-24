import mariadb from 'mariadb'

/* export function getConnection() {
  return mariadb.createConnection({
    host: "146.59.196.181",
    user: "admin",
    password: "zyhk.2Fp(r2gc030",
    database: "theBigProject"
  });
} */
export function getConnection() {
  return mariadb.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "theBigProject"
  });
}

export function createModel(table) {

  return {

    get: async function (id) {
      const conn = await getConnection()
      const res = await conn.query(`SELECT * FROM ${conn.escapeId(table)} WHERE id = ?`, [id])
      if (res.length == 1) {
        return res[0]
      } else {
        return false
      }
    },

    getBy: async function (params) {
      const conn = await getConnection()
      const condition = Object.keys(params).map((colName) => `${conn.escapeId(colName)} = ?`).join(' AND ')
      const values = Object.values(params)
      return await conn.query(`SELECT * FROM ${conn.escapeId(table)} WHERE ${condition}`, values)
    },

    getAll: async function () {
      const conn = await getConnection()
      return await conn.query(`SELECT * FROM ${conn.escapeId(table)}`)
    },

    create: async function (entity) {
      const conn = await getConnection()
      const colNames = Object.keys(entity).map((col) => conn.escapeId(col)).join(', ')
      const values = Object.values(entity)
      const placeholder = Array(values.length).fill('?').join(', ')
      const res = await conn.query(`INSERT INTO ${conn.escapeId(table)} (${colNames}) VALUES (${placeholder})`, values)
     // const testGet = await this.get(res.insertId)
      return await this.get(res.insertId)
    },

    update: async function (idOrCond, entity) {
      const conn = await getConnection();
      const setters = Object.keys(entity).map((colName) => `${conn.escapeId(colName)} = ?`).join(', ');
      const values = Object.values(entity);
    
      let query = `UPDATE ${conn.escapeId(table)} SET ${setters}`;
    
      if (typeof idOrCond === 'object') {
        const conditionKeys = Object.keys(idOrCond);
        const conditionValues = Object.values(idOrCond);
        const conditions = conditionKeys.map((key) => `${conn.escapeId(key)} = ?`).join(' AND ');
        query += ` WHERE ${conditions}`;
        values.push(...conditionValues);
      } else {
        query += ` WHERE id = ?`;
        values.push(idOrCond);
      }
    
      await conn.query(query, values);
      return await this.get(idOrCond);
    },
    

    delete: async function (id) {
      const conn = await getConnection()
      const res = await conn.query(`DELETE FROM ${conn.escapeId(table)} WHERE id = ?`, [id])
      return res.affectedRows == 1
    }
  }
}