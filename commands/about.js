const Discord = require('discord.js');
exports.run = (client, message) => {

const embed = new Discord.RichEmbed()
    .setTitle('General Information')
    .setDescription(`Information about ${message.guild.member(client.user).displayName}, and ${message.guild.name} server.`)
    .setColor(0x00AE86)
    .setThumbnail(client.user.displayAvatarURL)
    .addField('Server Information',`Members present on the server: ${message.guild.memberCount}\nServer Owner: ${message.guild.owner}`)
    .addField('Bot Information', `Total commands: ${client.commands.array().length}\nBot Uptime: ${(client.uptime/3600000).toFixed(2)} hours`)
    .setTimestamp()
    .setFooter('https://github.com/Darqam/Aura_Bot');

  message.channel.sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['info'],
  permLevel: 1
};

exports.help = {
  name: 'about',
  description: 'Adds a user to the selected list.',
  usage: 'about,\nReturns basic information about the bot and the server it is currently on.'
};
