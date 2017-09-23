const config = require('./config')
const Discord = require('discord.js')
const Manager = new Discord.ShardingManager('./statsbot.js', {
  'totalShards': 'auto',
  'respawn': true,
  'token': config.discord.token
})

Manager.spawn()

Manager.on('launch', shard => {
  console.log(`Shard spawned with ID ${shard.id}`)
})
