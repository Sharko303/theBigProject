import mariadb from 'mariadb'

export function getConnection() {
  return mariadb.createConnection({
    host: "146.59.196.181",
    user: "admin",
    password: "zyhk.2Fp(r2gc030",
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
      return await this.get(res.insertId)
    },

    update: async function (id, entity) {
      const conn = await getConnection()
      const setters = Object.keys(entity).map((colName) => `${conn.escapeId(colName)} = ?`).join(', ')
      const values = Object.values(entity)

      await conn.query(`UPDATE ${conn.escapeId(table)} SET ${setters} WHERE id = ?`, [...values, id])
      return await this.get(id)
    },

    delete: async function (id) {
      const conn = await getConnection()
      const res = await conn.query(`DELETE FROM ${conn.escapeId(table)} WHERE id = ?`, [id])
      return res.affectedRows == 1
    }
  }
}