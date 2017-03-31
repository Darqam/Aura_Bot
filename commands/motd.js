const settings = require('../files/settings.json');
const functions = require("../files/functions.js");

exports.run = function(client, message, args){
    let url = "https://api.guildwars2.com/v2/guild/"+settings.guildID+settings.userToken;

    functions.isApiKill(url, function getMOTD(data) {
        if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

        message.channel.sendMessage("The message of the day is: \n```\n"+data.motd+"```");	
    }); 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'motd',
  description: 'Displays the current Message of the Day for the guild',
  usage: 'motd'
};