exports.run = (client, message, args, level) => {
  if (!args[0]) {
    // Filter out commands they don't have permission to use
    myCommands = message.guild
      ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level)
      : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true)
    // Sort commands by their category
    const commandNames = myCommands.keyArray()
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)
    let currentCategory = ""
    // Create output string
    let output = `= Command List =\n\n[Use ${message.settings.prefix}help <commandname> for details]\n`
    // TODO: This doesn't seem to work. Need to create an issue on the Enmap github repo.
    /*const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1
      :  p.help.name > c.help.name && p.help.category === c.help.category
      ? 1 : -1 )*/
    myCommands.forEach( c => {
      const cat = c.help.category.toProperCase()
      if (currentCategory !== cat) {
        output += `\n== ${cat} ==\n`
        currentCategory = cat
      }
      output += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`
    })
    message.channel.send(output, {code:"asciidoc"})
  } else {
    // Give help if requested for a command
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command)
      if (level < client.levelCache[command.conf.permLevel]) return
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage :: ${command.help.usage}`, {code:"asciidoc"})
    }
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
}

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
}
