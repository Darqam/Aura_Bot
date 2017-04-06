const functions = require('../files/functions.js');

exports.run = (client, message) => {
    let url = "https://api.guildwars2.com/v2/quaggans";
    functions.isApiKill(url, function afterUrl(data){
        if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

        let quagganArray = data;
        (function (quagganArray) {
            let keys = Object.keys(quagganArray);
            let result = quagganArray[keys[ keys.length * Math.random() << 0]];
            message.channel.sendMessage("Coo!\nhttps://static.staticwars.com/quaggans/"+result+".jpg");
        })(quagganArray); 
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