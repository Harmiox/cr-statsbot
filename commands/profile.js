exports.run = async (client, message, args) => {
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setDescription('[Click Here](https://www.youtube.com/watch?v=8Pd29z0r7SE) to watch the official Touchdown Tournament live!')
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')

  //Check if the tag is valid
  const tag = client.helper.verifyTag(args[0] || message.user.cr_profile_tag, client)
  if (!tag) {
    embed.addField('Reason', 'Invalid Tag')
    embed.setColor(client.config.colors.issue)
    return message.channel.send('Request Failed', {embed})
  }

  //Send the API request
  client.request({
    uri: `${client.config.api.url}/players/%23${tag}`,
    headers: {
      'Authorization': client.config.api.token
    },
    json: true,
  }).then(profile => {
    client.helper.addPlayerInfo(embed, profile, client)
    // TODO: client.helper.addPlayerDeck(embed, profile, client)
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
  name: "profile",
  category: "Clash Royale",
  description: "Profile info for a Clash Royale player.",
  usage: "profile [tag]"
}
