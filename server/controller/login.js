import * as requete from '../models/auth.js'
import md5 from 'md5'
export function identification(request, reponse){

    
    let username = request?.body?.username;
    let password = request?.body?.password;
    //let sel = requete.getSalt(username);
    //password = md5(password + sel);
    password = md5(password);

        if(username && password)
            {
                var result = requete.getUser(username,password);
                if (result?.length > 0){
                    

                    // on redirige
                    reponse?.render('../views/page_utilisateur.ejs');
                } else 
                {
                    reponse?.render('../views/page_erreur.ejs')
                }
                reponse?.end();
            } else 
                {
                    //reponse.send('Entrez un nom de compte et un mot de passe !');
                    reponse?.end();

                
}}
export function accueil(req,res){

    res.render('../views/login.ejs');
    
}