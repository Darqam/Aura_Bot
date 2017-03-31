const fs = require('fs');
const functions = require("../files/functions.js");
const settings = require("../files/settings.json");

exports.run = (client, message, params) => {
    const blacklistPath = settings.botPath+"files/blacklist.json";
    const banlistPath = settings.botPath+"files/banlist.json";

    let badUsername = params[1];
    let listChoice = params[0];
    let listPath = "";

    if(!listChoice) return message.channel.sendMessage("Command was not valid.");

    if(listChoice.toUpperCase() === "BLACKLIST"){ listPath = blacklistPath; }
    else if(listChoice.toUpperCase() === "BANLIST"){ listPath = banlistPath; }
    else{ return message.channel.sendMessage("Could not understand list type, please choose either \`blacklist\` or \`banlist\`.")}
    
    let json = require(listPath);//get the array of baddies
    if (message.mentions.users.size < 1){//If there is no mention
        if(!badUsername) return message.channel.sendMessage("No user was specified, did you mean to query !GET <list>?");

        badUsername = badUsername.trim();
                    
        functions.getUserByName(badUsername, message, function haveId(badUser){//grab the user id from the displayname
            if(badUser === false) return message.channel.sendMessage("Could not find user, please type their display name exactly as seen on discord or mention them with \`@\`."); 
            
            if(json.indexOf(badUser.id) !== -1) return message.channel.sendMessage("User is already in the list, if this is unexpected, contact Daro.");
            
            json.push(badUser.id);
            fs.writeFile(listPath, JSON.stringify(json, null, 4), function (err){
                if(err){
                    message.channel.sendMessage("There was an issue in adding the user to the list.");
                    return console.log("Had issue writting file. "+err.message);
                }
                else{message.channel.sendMessage("User has been added to the list.");}
            });
        });
    }
    else if(listPath !== ""){//there is a mention and there is a proper list to write to
        //functions.writeBaddieList(message, listPath, message.mentions.users.first(), function finalCheck(status){});
        let badUser = message.mentions.users.first();
        if(json.indexOf(badUser.id) !== -1) return message.channel.sendMessage("User is already in the list, if this is unexpected, contact Daro.");
        json.push(badUser.id);
        fs.writeFile(listPath, JSON.stringify(json, null, 4), function (err){
            if(err){
                message.channel.sendMessage("There was an issue in adding the user to the list.");
                return console.log("Had issue writting file. "+err.message);
            }
            else{message.channel.sendMessage("User has been added to the list.");}
        });
    }
    delete require.cache[require.resolve(listPath)];//removes cache for json file containing baddies
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['add'],
  permLevel: 3
};

exports.help = {
  name: 'add to',
  description: 'Adds a user to the selected list.',
  usage: 'add to, [blacklist/banlist], usernameHere. Either blacklist or banlist must be selected, the username is to be written as seen in discord chat or as an \'@\' mention.'
};