const functions = require("../files/functions.js");

exports.run = (client, message, params) => {

    let query = "";
    if(params[0]){query = params[0].toUpperCase();}
    //console.log(input.split(" "));
    //var query = input.substring(7).trim();//removes prefix + "DAILY" from string
    let url = "";		
    
    if(query.indexOf("TOMORROW") == 0)//if user is asking for tomorrow's dailies
    {
        if(params[1]){query = params[1].toUpperCase().trim();}
        else{query = query.substring(8).trim();}
        url = "https://api.guildwars2.com/v2/achievements/daily/tomorrow";
    }
    else//it's today's dailies
    {
        url = "https://api.guildwars2.com/v2/achievements/daily";
    }
    functions.isApiKill(url, function onComplete(data) {
        if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

        if((query == "") || (query == "ALL"))//show all dailies
        {
            functions.lookupAllDaily(message, data, function post(output){
                message.channel.sendMessage(output);
            });
        }
        else if((query == "FOTM") || (query == "FRACTALS") || (query == "FRACTAL"))
        {
            functions.lookupDaily(message, data, "fractals", function post(output){
                output = "Fractal dailies: "+output;
                message.channel.sendMessage(output);
            });
        }
        else if(query == "PVE")
        {
            functions.lookupDaily(message, data, "pve", function post(output){
                output = "PvE dailies: "+output;
                message.channel.sendMessage(output);
            });
            
        }
        else if(query == "PVP")
        {
            functions.lookupDaily(message, data, "pvp", function post(output){
                output = "PvP dailies: "+output;
                message.channel.sendMessage(output);
            });
        }
        else if(query == "WVW")
        {
            functions.lookupDaily(message, data, "wvw", function post(output){
                output = "WvW dailies: "+output;
                message.channel.sendMessage(output);
            });
        }
        else if((query == "SPECIAL") || (query == "FESTIVAL"))
        {
            functions.lookupDaily(message, data, "special", function post(output){
                output = "Festival dailies: "+output;
                message.channel.sendMessage(output);
            });
        }
        else
        {
            message.channel.sendMessage("I don't recognize that query. Please try with one of the following parameters (caps not important): PvE/PvP/WvW/Fractals/Festival");
        }
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dailies', 'Dailies', 'Daily'],
  permLevel: 1
};

exports.help = {
  name: 'daily',
  description: 'Display the selected dailies.',
  usage: 'daily, <tomorrow> <pve/pvp/wvw/fotm/special>. Calling the function with no daily type will return the full list of dailies. Using \`tomorrow\` is optional.'
};