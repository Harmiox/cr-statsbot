exports.run = (client, message, args) => {
  message.channel.send(`${message.author}\n<https://discordapp.com/oauth2/authorize?permissions=278528&scope=bot&client_id=${client.user.id}>`)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
}

exports.help = {
  name: "invite",
  category: "System",
  description: "Get invite of link for your server.",
  usage: "invite"
}
