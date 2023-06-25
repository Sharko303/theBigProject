
export function handleError(error, res) {
  console.error(error)
    if (error.constructor.name == "SqlError") {
      res.status(400).json({ message: `L'opération n'a pas pu aboutir !`})
    } else {
      res.status(500).json({ message: `Toutes nos excuses, une erreur serveur à survenue` })
    }
  }
  
  
  // Jolie fonction qui englobe la logique générale des Controlleurs
  // Je passe la modèle qui va bien en paramètre
  export function createController(model) {
  
    return {

      get: async function (req, res) {
        try {
          // Récupération de l'entité par son ID en utilisant la fonction "get" du modèle
          const entity = await model.get(req.params.id);

          if (entity) {
            // Renvoi de l'entité en réponse
            res.json(entity);
          } else {
            // Si l'entité n'est pas trouvée, renvoi d'une erreur 404
            res.status(404).json(`${model._table} with id: ${req.params.id} not found`);
          }
        } catch (err) {
          // Gestion des erreurs
          handleError(err, res);
        }
      },

      getAll: async function (req, res) {
        try {
          // Récupération de toutes les entités en utilisant la fonction "getAll" du modèle
          res.json(await model.getAll());
        } catch (err) {
          // Gestion des erreurs
          handleError(err, res);
        }
      },

      post: async function (req, res) {
        try {
          // Création d'une nouvelle entité en utilisant les données du corps de la requête
          res.json(await model.create(req.body));
          return true;
        } catch (err) {
          // Gestion des erreurs
          handleError(err, res);
          return false;
        }
      },

      put: async function (req, res) {
        try {
          // Mise à jour de l'entité par son ID en utilisant la fonction "update" du modèle
          res.json(await model.update(req.params.id, req.body));
        } catch (err) {
          // Gestion des erreurs
          handleError(err, res);
        }
      },

      delete: async function (req, res) {
        try {
          // Suppression de l'entité par son ID en utilisant la fonction "delete" du modèle
          const success = await model.delete(req.params.id);
          if (success) {
            // Si la suppression est réussie, renvoi de la valeur "true"
            res.json(true);
          } else {
            // Si l'entité n'est pas trouvée, renvoi d'une erreur 404
            res.status(404).json(`${model.name} with id: ${req.params.id} not found`);
          }
        } catch (err) {
          // Gestion des erreurs
          handleError(err, res);
        }
      }
    }
}