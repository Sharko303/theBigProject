import mysql from 'mysql';

const db = mysql.createConnection({   host: "146.59.196.181",   user: "admin",   password: "zyhk.2Fp(r2gc030" });

db.connect(function(err) {   if (err) throw err;   console.log("Connecté à la base de données MySQL!"); });