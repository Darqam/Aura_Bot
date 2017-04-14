const Discord = require("discord.js");
const functions = require("../files/functions.js");

function sendEmbed(message, data, cap, server, cmdr, type){
    const embed = new Discord.RichEmbed()
        .setTitle(data["name"])
        .setAuthor(message.author.username)
        .setDescription('A quick overview of your account.')
        .setColor(message.member.highestRole.color)
        .setThumbnail(message.author.avatarURL)
        .addField("Account play time", `${(data["age"]*0.0000115741).toFixed(2)} days`)
        .addField("Ranks", `WvW: ${data["wvw_rank"]}, FotM: ${data["fractal_level"]}`)
        .addField("Daily AP", cap)
        .addField("Misc", `${type}\nAccount is on ${server}.\n${cmdr}`);
    message.channel.sendEmbed(
        embed,
        { disableEveryone: true }
    ).catch(console.log);

}


exports.run = (client, message) => {
    functions.getUserKey(message, message.author, function onComplete(user_key){
        if(user_key != ""){//only do work if user key is found. error handling already done in function
            let url = "https://api.guildwars2.com/v2/account?access_token="+user_key;
            
            functions.isApiKill(url, function onComplete(data) {
                if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

                let server = "";
                let type = "";
                let cap = "";
                let cmdr = "";

                let world_id = data["world"];
                url = "https://api.guildwars2.com/v2/worlds/"+world_id;
                functions.isApiKill(url, function toFinish(dataB){
                    try{
                        server = dataB["name"]
                    }
                    catch (err){
                        console.log(err);
                    }
                    let access = data["access"];
                    if(access == "PlayForFree"){ type = "Account is PlayForFree."; }
                    else if(access == "GuildWars2") { type = "Account owns the base game.";}
                    else if(access == "HeartOfThorns") { type = "Account owns Heart of Thorns."; }

                    let daily_ap = data["daily_ap"]+data["monthly_ap"];
                    if(daily_ap<15000){ cap = "Account has not reached daily+monthly AP cap: "+daily_ap.toString()+"/15000\n"; }
                    else{ cap = "Account has reached the daily/monthly AP cap.\n"; }

                    let is_cmdr = data["commander"];
                    if(is_cmdr){ cmdr = "Account does have a commander tag.\n"; }
                    else{ cmdr = "Account does not have a commander tag.\n"; }

                    sendEmbed(message, data, cap, server, cmdr, type);//simple work around to avoid async sending of data
                });

            });	
        }	
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['basic'],
  permLevel: 1
};

exports.help = {
  name: 'api basic',
  description: 'Returns basic information on your account',
  usage: 'api basic\nExtra Info: Will return account name, playtime, fotm&WvW rank, commander tag presence, current daily+monthly AP, which version of the game is owned, and the server it is on.'
};