exports.run = (client, message) => {
		message.channel.send(message.guild.emojis.find('name', 'rip').toString()).then(() => { process.exit(); });//makes use of this bot running on pm2
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['shutdown', 'reboot'],
  permLevel: 1
};

exports.help = {
  name: 'restart',
  description: 'Restarts the bot.',
  usage: 'restart'
};
