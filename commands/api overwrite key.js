const fs = require('fs');
const snekfetch = require('snekfetch');

exports.run = (client, message, params) => { 
    let details = "";
    let api_file = "./files/api_keys.json";

    if(params.length){ details = params[0].trim(); } //remove potential extra whitespace
    else { return message.channel.sendMessage("There was no provided API key, please use \`!help, api overwrite key\` for more information on this command."); }   

    fs.readFile(api_file, 'utf8', function read(err, data){
        if (err){
            message.channel.sendMessage("There was an issue in reading the API key storage.");
            return console.log("Had issue reading file. "+err.message);
        }
        let content = JSON.parse(data);//split text per line
        if(!content[message.author.id]) return message.channel.sendMessage("Could not find your API key anywhere, nothing overwritten.");
        
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
                
                message.channel.sendMessage("Your API key was successfully overwritten.");
            });
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