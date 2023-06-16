// Petite fonciton pratique
export function handleError(error, res) {
  console.error(error)
    if (error.constructor.name == "SqlError") {
      res.status(400).json({ message: `L'opération n'a pas pu aboutir à cause de vos données pérave, pauv' tâche !`})
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
          const entity = await model.get(req.params.id)
          if (entity) {
            res.json(entity)
          } else {
            res.status(404).json(`${model._table} with id: ${req.params.id} not found`)
          }
        } catch (err) {
          handleError(err, res)
        }
      },

      getAll: async function (req, res) {
        try {
          res.json(await model.getAll())
        } catch (err) {
          handleError(err, res)
        }
      },

  
      post: async function (req, res) {
        try {
          res.json(await model.create(req.body))
          return true
        } catch (err) {
          handleError(err, res)
          return false
        }
      },
  
      put: async function (req, res) {
        try {
          res.json(await model.update(req.params.id, req.body))
        } catch (err) {
          handleError(err, res)
        }
      },
  
      delete: async function (req, res) {
        try {
          const success = await model.delete(req.params.id)
          if (success) {
            res.json(true)
          } else {
            res.status(404).json(`${model.name} with id: ${req.params.id} not found`)
          }
        } catch (err) {
          handleError(err, res)
        }
      },
    }
  }