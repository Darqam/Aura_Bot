const fs = require('fs');
const settings = require('../files/settings.json');
const variables = require('../files/variables.json')

exports.run = (client, message, params) => {

    if(!parseInt(params[0])) return message.channel.sendMessage("The duration was not an integer value.");
    
    variables.timeOut = parseInt(params[0])*1000;
    fs.writeFile(settings.botPath+"files/variables.json", JSON.stringify(variables, null, 4), function (err){
        if(!err) return message.channel.sendMessage("Current timeout is now: "+variables.timeOut/1000+" seconds.");
        
        message.channel.sendMessage("There was an issue in writting new timeout.");
        console.log("Issue in writing timeout to file: "+err.message);
    });

    delete require.cache[require.resolve(settings.botPath+"files/variables.json")];//removes cache for json file containing baddies


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'set timeout',
  description: 'Change the timeout for the "fun" commands.',
  usage: 'set timeout, <####>. Set the timeout in seconds (in digits).'
};