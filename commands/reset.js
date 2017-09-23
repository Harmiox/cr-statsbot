exports.run = (client, message, args) => {
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')

  const channel_id_array = []
  message.mentions.channels.forEach(channelMention => {
    channel_id_array.push(channelMention.id)
  })

  message.settings.allowedChannels = channel_id_array
  const query = { discord_server_id: message.guild.id }
  const queryOptions = { upsert: true, new: true, runValidators: true }
  DiscordServer.findOneAndUpdate(query, message.settings, queryOptions).then(saved => {
    client.logger.info(`Server document saved for: ${message.guild.name} (${message.guild.id})`)
    embed.setDescription('Your channel(s) has been sucessfully reset!')
    embed.setColor(client.config.colors.default)
    message.channel.send(`Here you go ${message.author}!`, {embed})
  }).catch(err => {
    embed.setDescription('Due to a database error, I was unable to reset the channel(s).')
    embed.setColor(client.config.colors.issue)
    message.channel.send(`Oops, an error occured ${message.author}!`, {embed})
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Server Owner"
}

exports.help = {
  name: "reset",
  category: "Systems",
  description: "Reset the channel for the bot to respond in.",
  usage: "reset [tag]"
}
