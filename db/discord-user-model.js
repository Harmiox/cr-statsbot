const mongoose = require('mongoose')

/* Disord Server Schema */
const discordUserSchema = mongoose.Schema({
  discord_user_id: {
    type: String,
    required: true,
  },
  cr_profile_tag: {
    type: String,
    required: false,
  },
  cr_clan_tag: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('discord_user', discordUserSchema)
