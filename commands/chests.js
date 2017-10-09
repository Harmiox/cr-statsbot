exports.run = async (client, message, args) => {
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setDescription('*Update Hype!*')
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')

  //Check if the tag is valid
  const tag = client.helper.verifyTag(args[0] || message.user.cr_profile_tag, client)
  if (!tag) {
    embed.addField('Reason', 'Invalid Tag')
    embed.setColor(client.config.colors.issue)
    return message.channel.send('Request Failed', {embed})
  }

  client.request({
    uri: `${client.config.api.url}/players/%23${tag}/upcomingchests`,
    headers: {
      'Authorization': client.config.api.token
    },
    json: true,
  }).then(profile => {
    embed.setAuthor(tag)
    client.helper.addUpcomingChests(embed, profile, client)
    client.helper.addSpecialChests(embed, profile, client)
    embed.setColor(client.config.colors.default)
    message.channel.send(`Here you go ${message.author}!`, {embed})
  }).catch(response => {
    embed.addField('Reason', response)
    embed.setColor(client.config.colors.issue)
    message.channel.send('Request Failed', {embed})
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
}

exports.help = {
  name: "chests",
  category: "Clash Royale",
  description: "Upcoming chests for a Clash Royale player.",
  usage: "chests [tag]"
}
