import { createModel } from './model.js'

const model = createModel('Events')

const participantModel = createModel('Participants')

export default {
  ...model,

  get: async function (id) {
    const event = model.get(id)
    if (event == false) {
      return false
    }
    event.user_ids = (await participantModel.getBy({ event_id: id })).map(row => row.user_id)
  },
  getAll: async function () {
    const events = await model.getAll()
    if (events.length == 0) {
      return []
    }
    const participants = await participantModel.getAll();
    events.forEach(event => {
        event.user_ids = participants.filter((participant) => participant.event_id === event.id).map(row => row.user_id)
    });
    return events
  },
  join: async function (participants) {
    return await participantModel.create(participants)
  }
}