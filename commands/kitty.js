const snekfetch = require('snekfetch');

exports.run = (client, message) => {

  snekfetch.get("http://random.cat/meow").then( r => {
    //console.log(r);
    if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return message.channel.send("Something messed up");
    message.channel.send(r.body.file);
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