exports.run = (client, message, params) => {
		message.channel.sendMessage(message.guild.emojis.find('name', 'rip').toString()).then(() => { process.exit() });//makes use of this bot running on pm2
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'restart',
  description: 'Restarts the bot.',
  usage: 'restart. May take a few seconds to complete restart.'
};
