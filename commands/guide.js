exports.run = (client, message, params, perms) => {
	message.channel.sendMessage(`**RAID GUIDES**\n*Spirit Vale*: <http://tinyurl.com/Kaylas-SV-Guide>\n*Salvation Pass*: <http://tinyurl.com/Kaylas-SP-Guide>\n*Stronghold of the Faithful*: <http://tinyurl.com/Kaylas-SoF-Guide>\n**WIKI PAGES**\n*Spirit Vale*: <https://wiki.guildwars2.com/wiki/Spirit_Vale>\n*Salvation Pass*: <https://wiki.guildwars2.com/wiki/Salvation_Pass>\n*Stronghold of the Faithful*: <https://wiki.guildwars2.com/wiki/Stronghold_of_the_Faithful>`);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['guides'],
  permLevel: 1
};

exports.help = {
  name: 'guide',
  description: 'Shows links to raid guides.',
  usage: 'guide, displays guides for the first 3 released raid wings.'
};