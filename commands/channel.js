exports.run = async (client, message, args) => {
  const DiscordServer = require('../db/discord-server-model')
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')

  const channel_id_array = []
  message.mentions.channels.forEach(channelMention => {
    channel_id_array.push(channelMention.id)
  })

  if (channel_id_array.length < 1) {
    embed.addField('Reason', 'No channel mention(s) given!')
    embed.setColor(client.config.colors.issue)
    return message.channel.send('Channel setting failed!', {embed})
  }

  message.settings.allowedChannels = channel_id_array
  const query = { discord_server_id: message.guild.id }
  const queryOptions = { upsert: true, new: true, runValidators: true }
  DiscordServer.findOneAndUpdate(query, message.settings, queryOptions).then(saved => {
    client.logger.info(`Server document saved for: ${message.guild.name} (${message.guild.id})`)
    embed.setDescription('Your channel(s) has been sucessfully set! You can reset this with the `reset` command.')
    embed.setColor(client.config.colors.default)
    message.channel.send(`Here you go ${message.author}!`, {embed})
  }).catch(err => {
    embed.setDescription('Due to a database error, I was unable to set the channel.')
    embed.setColor(client.config.colors.issue)
    message.channel.send(`Oops, an error occured ${message.author}!`, {embed})
  })
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Server Owner"
}

exports.help = {
  name: "channel",
  category: "Systems",
  description: "Set the channel for the bot to respond in.",
  usage: "channel [tag]"
}
