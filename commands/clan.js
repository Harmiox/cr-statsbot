exports.run = async (client, message, args) => {
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')
  embed.setURL('https://github.com/Harmiox/cr-statsbot')

  //Check if the tag is valid
  const tag = client.helper.verifyTag(args[0] || message.user.cr_clan_tag, client)
  if (!tag) {
    embed.addField('Reason', 'Invalid Tag')
    embed.setColor(client.config.colors.issue)
    return message.channel.send('Request Failed', {embed})
  }

  client.request({
    uri: `${client.config.api.url}/clans/%23${tag}`,
    headers: {
      'Authorization': client.config.api.token
    },
    json: true,
  }).then(clan => {
    client.helper.addClanInfo(embed, clan, client)
    embed.setFooter('Developed by Harmiox')
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
  name: "clan",
  category: "Clash Royale",
  description: "Clan for a Clash Royale player.",
  usage: "clan [tag]"
}
