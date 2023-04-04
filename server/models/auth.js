import sqlite from 'sqlite-sync';
sqlite.connect('users.db');

export function getUser (username,password)
{
        var result = sqlite?.run(`SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`);
        return result;
    
}

/*export function getSalt (username)
{
        var sel = sqlite?.run(`SELECT salt FROM users WHERE username LIKE '${username}'`);
}*/