// This event executes when a new guild (server) is left.
module.exports = (client, guild) => {
  const DiscordServer = require('../db/discord-server-model')
  // Well they're gone. Let's remove them from the settings!
  client.logger.info(`Left the guild: ${guild.name}(${guild.id})`)
  DiscordServer.find({ discord_server_id: guild.id }).remove().exec()
};
