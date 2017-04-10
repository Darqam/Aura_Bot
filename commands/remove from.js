const fs = require('fs');
const functions = require("../files/functions.js");
const settings = require("../files/settings.json");

exports.run = (client, message, params) => {
    const blacklistPath = settings.botPath+"files/blacklist.json";
    const banlistPath = settings.botPath+"files/banlist.json";

    let badUsername = params[1];
    let listChoice = params[0];
    let listPath = "";

    if(listChoice.toUpperCase() === "BLACKLIST"){ listPath = blacklistPath; }
    else if(listChoice.toUpperCase() === "BANLIST"){ listPath = banlistPath; }
    else{ return message.channel.sendMessage("Could not understand list type, please choose either \`blacklist\` or \`banlist\`.");}

    let json = require(listPath);//get the array of baddies

    if (message.mentions.users.size < 1){//If there is no mention				
       functions.getUserByName(badUsername, message, function haveId(badUser){//grab the user id from the displayname
            if(badUser === false) return message.channel.sendMessage("Could not find user, please type their display name exactly as seen on discord.");
            if(json.indexOf(badUser.id) === -1) return message.channel.sendMessage("User was not found in the list, constact Daro is this is unexpected.");
            
            json = json.filter(function(e) { return e !== badUser.id; });
            fs.writeFile(listPath, JSON.stringify(json, null, 4), function (err){
                if(!err) return message.channel.sendMessage("User has been removed from the list.");
                
                message.channel.sendMessage("There was an issue in removing the user from the list.");
                return console.log("Had issue writting file. "+err.message);
            });
        });
    }
    else if(listPath !== ""){//there is a mention and there is a proper list to write to
        let badUser = message.mentions.users.first();
        json  = json.filter(function(e) { return e !== badUser.id; });
        fs.writeFile(listPath, JSON.stringify(json, null, 4), function (err){
            if(!err) return message.channel.sendMessage("User has been removed from the list.");
            
            message.channel.sendMessage("There was an issue in removing the user from the list.");
            return console.log("Had issue writting file. "+err.message);
        });

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
  name: 'remove from',
  description: 'Removes a user to the selected list.',
  usage: 'remove from, [blacklist/banlist], usernameHere. Either blacklist or banlist must be selected, the username is to be written as seen in discord chat or as an \'@\' mention.'
};

