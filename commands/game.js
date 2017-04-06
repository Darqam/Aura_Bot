exports.run = (client, message, params, perms) => {
    if(message.channel.type === "dm") return message.channel.sendMessage("Can't set game in DMs.");
    if(!params[0]){ 
        client.user.setGame(null); 
        message.channel.sendMessage("Yes mother, I'll stop playing.");
    }
    else{
        client.user.setGame(params[0]);
        message.channel.sendMessage("Now playing "+params[0]);
    }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['play'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'game',
  description: 'Change the played game displayed for the bot.',
  usage: 'game, gameNameHere. May take a minute to update. To remove displayed game, do not assign a game when calling the command.'
};