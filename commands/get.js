const fs = require('fs');
const functions = require("../files/functions.js");
const settings = require("../files/settings.json");

exports.run = (client, message, params) => {
    const blacklistPath = settings.botPath+"files/blacklist.json";
    const banlistPath = settings.botPath+"files/banlist.json";
    
    let badOutput = "Current list is:\n```\n";
	let listPath = "";
			    
    if(params[0].toUpperCase() === "BLACKLIST"){ listPath = blacklistPath; }
    else if(params[0].toUpperCase() === "BANLIST"){ listPath = banlistPath; }
    else{ return message.channel.sendMessage("Could not understand list type, please choose either \`blacklist\` or \`banlist\`.")}
    
    let json = require(listPath);
    if(json.length === 0) return message.channel.sendMessage("No users in list.");
    for(let i in json){
        let badId = json[i].trim();
        if(badId != ""){//don't try to find an ID for a blank line
            functions.getUserById(badId, message, function haveId(badUser){//grab the user id from the displayname
                if(badUser === false){ badOutput += "Could not find a User associated with Id: "+badId+'\n'; }
                else{
                    badOutput += badUser.displayName+'\n'
                }
            });
        }
        if(i == json.length-1){
            badOutput += "```";
            message.channel.sendMessage(badOutput);
        }
    }
    
    delete require.cache[require.resolve(listPath)];//removes cache for json file containing baddies
    
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'get',
  description: 'Will return users on the queried list.',
  usage: 'get, [blacklist/banlist]. Either blacklist or banlist must be selected, the username is to be written as seen in discord chat, nothing fancy.'
};