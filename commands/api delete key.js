const fs = require('fs');

exports.run = (client, message) => {
    let api_file = "./files/api_keys.json";
    
    fs.readFile(api_file, 'utf8', function read(err, data){
        if (err){
            return console.log("Had issue reading file. "+err.message);
        }

        let content = JSON.parse(data);
        if(!content[message.author.id]) return message.channel.sendMessage("Could not find an API key associated with your account. Nothing deleted.");

        if(delete content[message.author.id]){
            fs.writeFile(api_file, JSON.stringify(content, null, 4), function (err){
                if(!err) return message.channel.sendMessage("Your API key has been successfully removed.");
                
                message.channel.sendMessage("There was an issue in deleting your API key.");
                console.log("Had issue writting file. "+err.message);
            });
        }
        else{
            message.channel.sendMessage("There was an issue in deleting your API key.");
            console.log("Had issues deleting element from json object");
        }
    })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'api delete key',
  description: 'Removes your API key to the bot\'s database',
  usage: 'api delete key, <yourApiKey>'
};