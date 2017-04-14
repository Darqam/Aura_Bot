exports.run = (client, message) => {
    message.channel.sendMessage("HYPE!!!!!!\nhttp://i.imgur.com/1d58kOi.jpg");
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hype!!', 'hype!', 'hype!!!'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'hype',
  description: 'Displays hype.',
  usage: 'hype'
};