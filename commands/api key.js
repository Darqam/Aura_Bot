const fs = require('fs');
const settings = require('../files/settings.json');
const snekfetch = require('snekfetch');

exports.run = (client, message, params) => {
    let details = "";
    let api_file = "./files/api_keys.json";

    if(!params.length) return message.channel.sendMessage("There was no provided API key, please use \`!help, api key\` for more information on this command.");//if length is 0, return
  
    details = params[0].trim();//remove potential extra whitespace
    
    if(details.startsWith("OVERWRITE")) return message.channel.sendMessage("No actions performed. Were you trying to call **"+settings.prefix+"api overwrite key**? ");

        //first we find if user already has a saved key
    fs.readFile(api_file, 'utf8', function read(err, data){
        if (err){
            message.channel.sendMessage("There was an issue in reading the API key storage.");
            return console.log("Had issue reading file. "+err.message);
        }
        let content = JSON.parse(data);
        if(content[message.author.id]) return message.channel.sendMessage("Your key is already set. If you want to overwrite, please use the command **"+settings.prefix+"api overwrite key, ApiKeyHere**");

        let key_url = "https://api.guildwars2.com/v2/tokeninfo?access_token="+details;
        snekfetch.get(key_url).then( r => {
            if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return message.channel.sendMessage("The API key was not valid, or there was an issue on the API end. Nothing saved.");
            
            //now check if progression is enabled on this api key
            if(!r.body.permissions.includes("progression")) return message.channel.sendMessage("The API key does not have the \`progression\` scope selected. This is needed in order to function. Nothing saved.");

            content[message.author.id] = details;
            fs.writeFile(api_file, JSON.stringify(content, null, 4), function (err){
                if (err) {
                    message.channel.sendMessage("There was an issue in saving your API key.");
                    return console.log("Had issue writting file. "+err.message);
                }
                
                message.channel.sendMessage("Your API key has been saved to your unique user ID.");
            });
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'api key',
  description: 'Adds your API key to the bot\'s database',
  usage: 'api key, [yourApiKey]'
};