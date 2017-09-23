exports.run = (client, message, args) => {
  const DiscordUser = require('../db/discord-user-model')
  const Discord = require('discord.js')
  const embed = new Discord.RichEmbed()
  embed.setFooter('cr-statsbot', 'https://pbs.twimg.com/profile_images/616309728688238592/pBeeJQDQ.png')

  //Check if the tag is valid
  const tag = client.helper.verifyTag(args[0], client)
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
    DiscordUser.findOne({ discord_user_id: message.author.id })
      .then(serverDocument => {
        const newUserDocument = {}
        newUserDocument.discord_user_id = message.author.id
        newUserDocument.cr_profile_tag = profile.tag
        if (profile.clan) newUserDocument.cr_clan_tag = profile.clan.tag
        const query = { discord_user_id: message.author.id }
        const queryOptions = { upsert: true, new: true, runValidators: true }
        DiscordUser.findOneAndUpdate(query, newUserDocument, queryOptions).then(saved => {
          client.logger.info(`User document saved for: ${message.author.username} (${message.author.id})`)
          embed.setDescription('Your tag has been sucessfully saved!')
          embed.setColor(client.config.colors.default)
          message.channel.send(`Woohoo! ${message.author}!`, {embed})
        })
      })
      .catch(err => {
        client.logger.warn('An error occured when finding a user document.')
        embed.addField('Reason', response)
        embed.setColor(client.config.colors.issue)
        message.channel.send('Request Failed', {embed})
      })
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
  name: "save",
  category: "Clash Royale",
  description: "Save a Clash Royale player tag to a discord ID.",
  usage: "save [tag]"
}
