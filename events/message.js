const settings = require('../files/settings.json');
const variables = require('../files/variables.json')
const functions = require("../files/functions.js");

var timedOut = variables.timeOut;

module.exports = message => {
  let logPath = settings.botPath+"files/log.txt";
  let client = message.client;
  if (message.author.bot) return;//if user is bot, ignore
  if (!message.content.startsWith(settings.prefix)) return;//if message doesn't start with prefix, ignore

  let command = message.content.split(', ')[0].slice(settings.prefix.length).toLowerCase();
  let params = message.content.split(', ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  else{
    message.channel.sendMessage("If that was intended for me, I didn't understand it.");
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel){
      functions.writeToLog(message, "Denied: ", logPath);
      return;
    }
    else{//here check cmd.conf.type for "fun", if they are make the needed checks here
      if(cmd.conf.type === "fun"){
        if(settings.funChannels.indexOf(message.channel.id) !== -1 || message.channel.type === "dm"){
          if(client.timedOut(message) === false || message.channel.type === "dm"){
            cmd.run(client, message, params, perms);
            functions.writeToLog(message, "", logPath);
          } 
          else{ functions.writeToLog(message, "TimedOut: ", logPath); }
        }
      }
        
      else{
        functions.writeToLog(message, "", logPath);
        cmd.run(client, message, params, perms);
      }
    }
  }
};