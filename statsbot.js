// Load everything that'll be useful
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const mongoose = require('mongoose')
const bluebird = require('bluebird')
const Enmap = require('enmap')
const req = require('request')

// Load up the discord.js library and set up the client
const Discord = require('discord.js')
const client = new Discord.Client()
require('./util/functions.js')(client)
client.request = require('request-promise')
client.config = require('./config')
client.helper = require('./util/helper')
client.logic = require('./util/logic')
client.commands = new Enmap()
client.aliases = new Enmap()

//Init function for node 8 async/await stuff
const init = async () => {

  createMongooseClient()

  const cmdFiles = await readdir("./commands/")
  client.logger.info(`Loading a total of ${cmdFiles.length} command(s).`)
  cmdFiles.forEach(f => {
    try {
      const props = require(`./commands/${f}`)
      if (f.split(".").slice(-1)[0] !== "js") return
      client.commands.set(props.help.name, props)
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name)
      })
    } catch (e) {
      client.logger.error(`Unable to load command ${f}: ${e}`)
    }
  })

  // Load events
  const evtFiles = await readdir("./events/")
  client.logger.info(`Loading a total of ${evtFiles.length} event(s).`)
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0]
    const event = require(`./events/${file}`)
    // Bind events to event lister
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`./events/${file}`)]
  })

  // Generate a cache of client permissions
  client.levelCache = {}
  for (let i = 0; i < client.config.discord.permLevels.length; i++) {
    const thisLevel = client.config.discord.permLevels[i]
    client.levelCache[thisLevel.name] = thisLevel.level
  }

  // Login the client
  client.login(client.config.discord.token)

  // End top-level async/await function.
}

function createMongooseClient() {
  // Setup mongoose connection
  mongoose.Promise = bluebird

  const uri = `mongodb://${client.config.mongodb.host}:${client.config.mongodb.port}/${client.config.mongodb.database}`
  mongoose.connect(uri, { useMongoClient: true })

  mongoose.connection.on('connected', () => {
    client.logger.info(`[Mongoose] Mongoose default connection open to ${uri}`)
  })

  mongoose.connection.on('error', (err) => {
    client.logger.error(`[Mongoose] Mongoose default connection error: ${err}`)
  })

  mongoose.connection.on('disconnected', () => {
    client.logger.warn('[Mongoose] Mongoose default connection disconnected')
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      client.logger.info('[Mongoose] Mongoose default connection disconnected through app termination')
      process.exit(0)
    })
  })
}

init()
