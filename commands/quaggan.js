const snekfetch = require('snekfetch');

exports.run = (client, message) => {
    snekfetch.get("https://api.guildwars2.com/v2/quaggans").then( r => {
        if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

        message.channel.sendMessage("Coo!\nhttps://static.staticwars.com/quaggans/"+r.body[Math.floor(Math.random() * r.body.length)]+".jpg");

    });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['coo', 'quaggans'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'quaggan',
  description: 'Displays a random quaggan image',
  usage: 'quaggan'
};