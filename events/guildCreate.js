// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  // We need to add this guild to our settings!
  const DiscordServer = require('../db/discord-server-model')
  DiscordServer.findOne({ discord_server_id: guild.id })
    .then(serverDocument => {
      // If the guild doesn't have a server document, than
      // we make one for it.
      if (!serverDocument) {
        // Set up the new document
        newServerDocument = client.config.discord.defaultSettings
        newServerDocument.discord_server_id = guild.id
        const query = { discord_server_id: guild.id }
        const queryOptions = { upsert: true, new: true, runValidators: true }
        // Save/Update the document
        DiscordServer.findOneAndUpdate(query, newServerDocument, queryOptions).then(saved => {
          client.logger.info(`Server document saved for: ${guild.name} (${guild.id})`)
        })
      }
    })
    .catch(err => {
      // Hopefully this never happens!
      client.logger.warn('An error occured when finding a server document.')
    })
};
