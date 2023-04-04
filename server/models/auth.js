import * as bdd from './connexionbdd.js';
export function getUser (username,password)
{
        var req = bdd?.run(`SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`);
        return result;
    
}

/*export function getSalt (username)
{
        var sel = sqlite?.run(`SELECT salt FROM users WHERE username LIKE '${username}'`);
}*/
