/* import db from './connexionbdd.js';

export async function getSalt(username) {
        try {
                const conn = await db;
                const rows = await conn.query(`SELECT salt FROM Users WHERE username LIKE '${username}'`);
                if (rows.length > 0) {
                        return rows[0].salt;
                } else {
                        throw new Error("Aucun utilisateur trouvé avec ce nom d'utilisateur.");
                }
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
}

export async function verifUser(username, password) {
        let response = false;
        try {
                const conn = await db;
                const rows = await conn.query(`SELECT * FROM Users WHERE username LIKE '${username}' AND password LIKE '${password}'`);
                if (rows.length === 1) {
                        const user = rows[0];
                        if (user.active === 1) {
                                response = true;
                        } else {
                                throw new Error("Vous devez vérifier votre compte.");
                        }
                } else {
                        throw new Error("Aucun utilisateur trouvé avec ce nom d'utilisateur et ce mot de passe.");
                }
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
        return response;
}

export async function setUser(username, password, email, salt, confirmUrl, token) {
        try {
                const conn = await db;
                const query = `INSERT INTO Users (username, password, email, salt, active, url_confirm, token) VALUES (?, ?, ?, ?, 0, ?, ?);`;
                const params = [username, password, email, salt, confirmUrl, token];
                const result = await conn.query(query, params);
                return result;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête INSERT:", err);
                throw err;
        }
}

export async function alreadyUsed(username, email) {
        let result;
        try {
                const conn = await db;
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
export async function getUserInfo(token) { // byToken
        const conn = await db;
        // Faire la requête SQL pour récupérer le token dans la base de données
        const sql = "SELECT * FROM Users WHERE token = ?";
        try {
                const rows = await conn.query(sql, [token]);

                // Vérifier si un token a été trouvé
                if (rows.length > 0) {
                        // Si oui, retourner l'objet contenant les informations du token
                        console.log(rows[0].token)
                        return rows[0];
                } else {
                        // Sinon, retourner null
                        console.log("null");
                        return null;
                }
        } catch {
                throw error;
        }
}
export async function setAccountActive(token) {
        const conn = await db;
        const sql = "UPDATE Users SET active = 1 WHERE token = ?";
        try {
                const result = await conn.query(sql, [token]);
                console.log(`Updated ${result.affectedRows} rows`);
                console.log(result)
        } catch (error) {
                console.error(error);
                throw error;
        }
}
export async function getToken(username) {
        try {
                const conn = await db;
                const rows = await conn.query(`SELECT token FROM Users WHERE username LIKE '${username}'`);
                if (rows.length > 0) {
                        return rows[0].token;
                } else {
                        throw new Error("Aucun utilisateur trouvé avec ce nom d'utilisateur.");
                }
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
}
export async function getUserById(id) {
        try {
                const conn = await db;
                const rows = await conn.query(`SELECT username FROM Users WHERE user_id LIKE '${id}'`);
                return rows[0].username
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
}

export async function getAll(table, critere) {
        try {
                const conn = await db;
                const sql = `SELECT * FROM ${table} WHERE ${critere}`;
                const [rows] = await conn.query(sql);
                return rows;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
}
export async function getData(colone, table, critere = '', value = '') {
        try {
                const conn = await db;
                let sql = `SELECT ${colone} FROM ${table}`;

                if (critere && value) {
                        sql += ` WHERE ${critere} LIKE '${value}'`;
                }

                const rows = await conn.query(sql);
                return rows;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
}

export async function getDatas(colone, table, critere, values) {
        try {
                const conn = await db;
                const sql = `SELECT ${colone} FROM ${table} WHERE ${critere} IN (${values.map(() => '?').join(',')})`;
                const rows = await conn.query(sql, values);
                return rows;
        } catch (err) {
                console.error("Erreur lors de l'exécution de la requête SELECT:", err);
                throw err;
        }
} */