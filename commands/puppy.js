const randomPuppy = require('random-puppy');

exports.run = (client, message, params, perms) => {

randomPuppy()
    .then(url => {
        message.channel.sendMessage(url);
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['puppys', 'puppies', 'dog', 'doggie', 'doggy'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'puppy',
  description: 'Links a random cat picture',
  usage: 'puppy'
};