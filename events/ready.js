module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  await client.wait(1000)

  //Had to declare this so that the collection is made.
  const DiscordServer = require('../db/discord-server-model')
  //If the bot is added to guilds when it's offline
  for (let guild of client.guilds.values()) {
    DiscordServer.findOne({ discord_server_id: guild.id })
      .then(serverDocument => {
        //If the guild doesn't already have a server document
        if (!serverDocument) {
          newServerDocument = client.config.discord.defaultSettings
          newServerDocument.discord_server_id = guild.id
          const query = { discord_server_id: guild.id }
          const queryOptions = { upsert: true, new: true, runValidators: true }
          DiscordServer.findOneAndUpdate(query, newServerDocument, queryOptions).then(saved => {
            client.logger.info(`Server document saved for: ${guild.name} (${guild.id})`)
          })
        }
      })
      .catch(err => {
        client.logger.warn('An error occured when finding a server document.')
      })
  }

  client.logger.info(`Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!")
};
