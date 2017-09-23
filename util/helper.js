function verifyTag(tag, client) {
  if (!tag) return false
  tag = tag.toUpperCase().replace('#', '').replace(/O/g, '0')
  for (var i = 0; i < tag.length; i++) {
    if (!client.logic.tag_characters.includes(tag[i])) {
      return false
    }
  }
  return tag
}

function commas(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addPlayerInfo(embed, data, client) {
  //TODO Arena Thumbnail & Clan Badge Author Icon
  embed.setAuthor(`${data.name} (${data.tag})`)
  embed.addField('Arena', data.arena.name, true)
  embed.addField('Level', data.expLevel, true)
  embed.addField('Trophies', commas(data.trophies), true)
  embed.addField('Best Trophies', commas(data.bestTrophies), true)
  embed.addField('Wins', data.wins, true)
  embed.addField('Losses', data.losses, true)
  embed.addField('Total Battles', commas(data.battleCount), true)
  embed.addField('Three Crown Wins', commas(data.threeCrownWins), true)
  embed.addField('Challenge Cards Won', commas(data.challengeCardsWon), true)
  embed.addField('Max Challenge Wins', data.challengeMaxWins, true)
  embed.addField('Tournament Cards Won', commas(data.tournamentCardsWon), true)
  embed.addField('Total Tournaments', commas(data.tournamentBattleCount), true)
  embed.addField('Cards Found', data.cards.length || '0', true)
  embed.addField('Favorite Card', data.currentFavouriteCard.name || 'Not Available', true)
  if (data.clan) embed.addField(`Clan (${data.role})`, data.clan.name || '\u200b', true)
}

function addUpcomingChests(embed, data, client) {
  let cycle = ''
  for (let i = 0; i < 7; i++) {
    const chest = data.items[i]
    if (chest.index === 1 || chest.index === 0) cycle += " | "
    cycle += client.logic.emojis.chests[chest.name] || client.logic.emojis.wifi
  }
  embed.addField('Upcoming Chests', cycle || 'Not Available', true)
}

function addUpcomingCycle(embed, data, client) {
  let cycle = ''
  embed.addField('Upcoming Chests','\u200b', true)
  for (let i = 0; i < 240; i++) {
    const chest = data.items[i]
    if (chest.index === 1 || chest.index === 0) cycle += " | "
    cycle += client.logic.emojis.chests[chest.name] || client.logic.emojis.wifi
    if (cycle.length > 950)
      embed.addField('\u200b', cycle || 'Not Available', true)
  }
  embed.addField('\u200b', cycle || 'Not Available', true)
}

function addSpecialChests(embed, data, client){
  let until = ''
  const chests = ['Giant Chest', 'Magical Chest', 'Epic Chest', 'Legendary Chest', 'Super Magical Chest']
  for (let i = 0; i < data.items.length; i++) {
    const chest = data.items[i]
    if (chests.indexOf(chest.name) >= 0) until += `${client.logic.emojis.chests[chest.name]}${chest.index} `
  }
  embed.addField('Chests Until', until || 'Not Available', true);
}

function addPlayerDeck(embed, data, client) {
  let deck = 'This will return soon!';
  // TODO: Player Deck Endpoint
  embed.addField('Battle Deck', deck || 'Not Available', true);
}

function addClanInfo(embed, data, client) {
  //TODO Clan Badge Thumbnail
  embed.setAuthor(`${data.name} (${data.tag})`)
  embed.setDescription(data.description || '\u200b')
  embed.addField('Type', data.type, true)
  embed.addField('Score', `${commas(data.clanScore)} trophies`, true)
  embed.addField('Required Trophies', data.requiredTrophies || '\u200b', true)
  embed.addField('Donations/Week', `${commas(data.donationsPerWeek)} cards`, true)
  embed.addField('Chest Status', data.clanChestStatus, true)
  embed.addField('Location', data.location.name, true)
  embed.addField('Members', `${data.members}/50`, true)
}

module.exports = {
  verifyTag,
  commas,
  addPlayerInfo,
  addUpcomingChests,
  addUpcomingCycle,
  addSpecialChests,
  addPlayerDeck,
  addClanInfo
}
