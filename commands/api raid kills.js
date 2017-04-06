const jsonData = require('../files/data.json');
const functions = require("../files/functions.js");

exports.run = (client, message, params) => {
    functions.getUserKey(message, message.author, function onComplete(user_key){
        if(user_key === "") return;//handle message is sent in getUserKey function

        let output = "Kills still missing this week:\n```\n"
        let url = "https://api.guildwars2.com/v2/account/raids?access_token="+user_key;
        functions.isApiKill(url, function afterUrl(data){
            if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");
            if(data == "")
                return message.channel.sendMessage("```\nNo kills for you.\n```:regional_indicator_g: :regional_indicator_i: :regional_indicator_t:   :regional_indicator_g: :regional_indicator_u: :regional_indicator_d:");

            let keys = Object.keys(jsonData.bosses);
            let arrDiff = keys.filter(x => data.indexOf(x) < 0);
            
            if(arrDiff.length === 0) return message.channel.sendMessage(":first_place:```\nYou have defeated all of the evil forces, you may rest until next week.\n```");
            
            let i = 0;
            while(i < arrDiff.length)
            {
                output += jsonData.bosses[arrDiff[i]].name+'\n';
                i += 1;
            }
            output += '```';
            
            message.channel.sendMessage(output);
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['api raid kill'],
  permLevel: 1
};

exports.help = {
  name: 'api raid kills',
  description: 'Shows which raid encounters have been cleared this week',
  usage: 'api raid kills'
};