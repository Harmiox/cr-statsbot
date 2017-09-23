const mongoose = require('mongoose')

/* Disord Server Schema */
const discordServerSchema = mongoose.Schema({
  discord_server_id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  adminRole: {
    type: String,
    required: true,
  },
  systemNotice: {
    type: String,
    required: true,
  },
  newGuildMessage: {
    type: String,
    required: true,
  },
  allowedChannels: [{
    type: String
  }],
})

module.exports = mongoose.model('discord_server', discordServerSchema)
