import { handleError, createController } from './controller.js'

// J'importe le model qui va bien
import model from '../models/event.js'

const controller = createController(model)

// J'exporte mon modèle
export default {
    ...controller,

    
}