const fs = require('fs');
const functions = require("../files/functions.js");

exports.run = (client, message, params) => { 
    let details = "";
    let api_file = "./files/api_keys.json"

    if(params.length){ details = params[0].trim(); } //remove potential extra whitespace
    else {
        message.channel.sendMessage("There was no provided API key, please use \`!help, api overwrite key\` for more information on this command."); 
        return;
    }
    let flag = false;
    let id_check = "";
    let length = 0;
    let content = [];
    

    fs.readFile(api_file, 'utf8', function read(err, data){
        if (err){
            message.channel.sendMessage("There was an issue in reading the API key storage.");
            return console.log("Had issue reading file. "+err.message);
        }
        let content = JSON.parse(data);//split text per line
        if(!content[message.author.id]) return message.channel.sendMessage("Could not find your API key anywhere, nothing overwritten.");
        
        let key_url = "https://api.guildwars2.com/v2/account?access_token="+details;
        functions.isApiKill(key_url, function onComplete(check){
            if((check != false) && (check["text"] != "invalid key"))//if the key actually works
            {
                content[message.author.id] = details;
                fs.writeFile(api_file, JSON.stringify(content, null, 4), function (err){
                    if (err) {
                        message.channel.sendMessage("There was an issue in saving your new API key.");
                        return console.log("Had issue writting file. "+err.message);
                    } 
                    message.channel.sendMessage("Your API key was successfully overwritten.");
                });
            }
            else{message.channel.sendMessage("The API key was not valid, or there was an issue on the API end. Nothing saved"); }
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['overwrite api key'],
  permLevel: 1
};

exports.help = {
  name: 'api overwrite key',
  description: 'Overwrite your currently set API key.',
  usage: 'api overwrite key, [yourApiKey]'
};