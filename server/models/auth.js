import db from './connexionbdd.js';

export function getUser(username, password, callback) {
        db.query(`SELECT * FROM Users WHERE username LIKE '${username}' AND password LIKE '${password}'`, (error, results, fields) => {
                if (error) {
                        callback(error, null);
                } else {
                        callback(null, results);
                }
        });
}
export function setUser(username, password, email, salt, confirmUrl, callback) {
        db.query(`INSERT INTO Users (username, password, email, salt, active, url_confirm) VALUES ('${username}', '${password}', '${email}', '${salt}',0 , '${confirmUrl}');`, (error, results, fields) => {
                if (error) {
                        callback(error, null);
                } else {
                        callback(null, results);
                }
        });
}
export function getSalt(username, callback) {
        db.query(`SELECT salt FROM Users WHERE username LIKE '${username}'`, (error, results, fields) => {
          if (error) {
            callback(error, null);
          } else if (results && results.length > 0) {
            callback(null, results[0].salt);
          } else {
            callback(new Error(`Aucun utilisateur trouvé avec le nom d'utilisateur '${username}'`), null);
          }
        });
      }