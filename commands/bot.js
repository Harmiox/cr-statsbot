exports.run = async (client, message, args) => {
  // The stuff we need :0
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  const DiscordServer = require('../db/discord-server-model')
  const DiscordUser = require('../db/discord-user-model')

  // Time stuff D:
  const ms = client.uptime
  let x = ms / 1000
  const seconds = x % 60
  x /= 60
  const minutes = x % 60
  x /= 60
  const hours = x % 24
  x /= 24
  const days = x

  // MongoDB Count()
  const serverCount = await DiscordServer.count()
  client.logger.debug(serverCount)
  const userCount = await DiscordUser.count()

  // Build the embed!
  embed.setAuthor(`${client.user.username}`, client.user.displayAvatarURL)
  embed.setColor(0xF0E547)
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')
  embed.setURL('https://github.com/Harmiox/cr-statsbot')
  embed.addField('GitHub', '[cr-statsbot](https://github.com/Harmiox/cr-statsbot)', true);
  embed.addField('Servers', serverCount, true);
  embed.addField('Saved Tags', userCount, true);
  embed.addField('Support Server', '[Discord](https://discord.gg/8YbUphc)', true);
  embed.addField('Invite Link', `[Click Here](https://discordapp.com/oauth2/authorize?permissions=278528&scope=bot&client_id=${client.user.id})`, true);
  embed.addField('Donate', '[PayPal](https://paypal.me/jayq)', true);
  embed.addField('Developers', '[harmiox](https://discord.gg/8YbUphc)', true);
  embed.addField('Uptime', `${Math.floor(days)}days ${Math.floor(hours)}hours ${Math.floor(minutes)}minutes ${Math.floor(seconds)}seconds`, true);
  message.channel.send(`Here you go ${message.author}!`, {embed})
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
}

exports.help = {
  name: "bot",
  category: "System",
  description: "Bot information",
  usage: "bot"
}
