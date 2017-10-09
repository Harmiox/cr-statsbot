exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply(`Bot is shutting down. If you do not have PM2 installed & setup you'll have to manually start the bot back up.`)
  client.shard.broadcastEval('process.exit(1)')
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
}

exports.help = {
  name: "reboot",
  category: "System",
  description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot"
}
