const variables = require('../files/variables.json');

exports.run = (client, message) => {
    message.channel.send("The current timeout is: "+variables.timeOut/1000+" seconds.");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'view timeout',
  description: 'View the currently set timeout for the "fun" commands.',
  usage: 'view timeout'
};