// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return
  if (message.content.startsWith('#')) return message.channel.send("The `#` prefix has been changed to `!`. Example: `!profile TAG`")

  // Grab the settings for this server from MongoDB
  // If there is no guild, get default conf (DMs)
  const DiscordServer = require('../db/discord-server-model')
  const guild_id = message.guild ? message.guild.id : 0
  let settings = await DiscordServer.findOne({ discord_server_id: guild_id })
  if (!settings) settings = client.config.discord.defaultSettings
  message.settings = settings

  // Grab the settings for the user from MongoDB
  // If the user is not in the DB, use an emtpy Object
  const DiscordUser = require('../db/discord-user-model')
  let user = await DiscordUser.findOne({ discord_user_id: message.author.id })
  if (!user) user = {}
  message.user = user

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(settings.prefix) !== 0) return

  // Here we separate our "command" name, and our "arguments" for the command.
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command !== 'reset') {
    const channel = settings.allowedChannel || message.channel.id
    if (channel !== message.channel.id) return
  }

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message)

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (message.channel.type !== "text" || message.settings.systemNotice === "true") {
    if (level < client.levelCache[cmd.conf.permLevel])
      return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${client.config.discord.permLevels.find(l => l.level === level).name})
This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`)
  }
  // If the command exists, **AND** the user has permission, run it.
  //client.logger.info(`${client.config.discord.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
  cmd.run(client, message, args, level);
};
