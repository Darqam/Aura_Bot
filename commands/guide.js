const Discord = require('discord.js');
exports.run = (client, message) => {

  const embed = new Discord.RichEmbed()
    .setTitle('Raid Guides')
    .setDescription('A collection of links to help you in your raiding endeavours.')
    .setColor(0x00AE86)
    .setThumbnail('https://wiki.guildwars2.com/images/1/1f/Spirit_Vale_%28achievements%29.png')
    .addField('Kaylas\'s Guides','[Spirit Vale](http://tinyurl.com/Kaylas-SV-Guide) -- [Salvation Pass](http://tinyurl.com/Kaylas-SP-Guide) -- [Stronghold of the Faithful](http://tinyurl.com/Kaylas-SoF-Guide)')
    .addField('Wiki Pages', '[Spirit Vale](https://wiki.guildwars2.com/wiki/Spirit_Vale) -- [Salvation Pass](https://wiki.guildwars2.com/wiki/Salvation_Pass) -- [Stronghold of the Faithful](https://wiki.guildwars2.com/wiki/Stronghold_of_the_Faithful) -- [Bastion of the Penitent](https://wiki.guildwars2.com/wiki/Bastion_of_the_Penitent)')
    .setTimestamp()
    .setFooter('Happy Raiding!');

  message.channel.sendEmbed(embed);

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
  usage: 'guide, displays guides for the first 4 released raid wings.'
};