import mariadb from 'mariadb';

const db = mariadb.createConnection({
    host: "146.59.196.181",
    user: "admin",
    password: "zyhk.2Fp(r2gc030",
    database: "theBigProject"
  });
  
  db.then(conn => {
    console.log("Connecté à la base de données MariaDB!");
  }).catch(err => {
    console.error("Erreur de connexion à la base de données:", err);
  });

export default db;