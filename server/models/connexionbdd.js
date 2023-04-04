const mysql = require('mysql');

const db = mysql.createConnection({   host: "146.59.196.181",   user: "root",   password: "" });

db.connect(function(err) {   if (err) throw err;   console.log("Connecté à la base de données MySQL!"); });