const request = require('request');

exports.run = (client, message, params, perms) => {

request("http://random.cat/meow", function (error, response, body) {
          body = JSON.parse(body)["file"];
          message.channel.sendMessage(body)
        });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cats', 'cat'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'kitty',
  description: 'Links a random cat picture',
  usage: 'kitty'
};