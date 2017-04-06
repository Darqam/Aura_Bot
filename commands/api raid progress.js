const functions = require("../files/functions.js");

exports.run = (client, message, params) => {
    let counter = 0;
    let SV = Array.apply(null, Array(3)).map(function () {});
    let SP = Array.apply(null, Array(3)).map(function () {});
    let SotF = Array.apply(null, Array(3)).map(function () {});
    let BotP = Array.apply(null, Array(4)).map(function () {});
    
    let SPcm = Array.apply(null, Array(3)).map(function () {});
    let SotFcm = Array.apply(null, Array(3)).map(function () {});
    let BotPcm = Array.apply(null, Array(4)).map(function () {});

    
    functions.getUserKey(message, message.author, function onComplete(user_key){
        if(user_key === "") return message.channel.sendMessage("Could not find an API key associated with your discord ID.");
        let url = "https://api.guildwars2.com/v2/account/achievements?access_token="+user_key;
        functions.isApiKill(url, function afterUrl(data){
            if(data === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

            for(var key in data)
            {
                counter += 1;
                //Do kills here
                //check SV bosses
                if(data[key]["id"] == 2654){ SV[0] = "Vale Guardian"; }
                if(data[key]["id"] == 2667){ SV[1] = "Gorseval"; }
                if(data[key]["id"] == 2659){ SV[2] = "Sabetha"; }
                
                //check SP bosses
                if(data[key]["id"] == 2826){ SP[0] = "Slothasor"; }
                if(data[key]["id"] == 2830){ SP[1] = "Trio"; }
                if(data[key]["id"] == 2836){ SP[2] = "Matthias"; }
                
                //check SotF bosses
                if(data[key]["id"] == 3024){ SotF[0] = "Escort"; }
                if(data[key]["id"] == 3014){ SotF[1] = "Keep Construct"; }
                if(data[key]["id"] == 3017){ SotF[2] = "Xera"; }
                
                //check BotP bosses
                if(data[key]["id"] == 3349){ BotP[0] = "Cairn"; }
                if(data[key]["id"] == 3321){ BotP[1] = "Mursaat Overseer"; }
                if(data[key]["id"] == 3347){ BotP[2] = "Samarog"; }
                if(data[key]["id"] == 3364){ BotP[3] = "Deimos"; }
                
                //Do Challenge Mote check here
                //SV has no challenge mote
                
                //check SP bosses
                if(data[key]["id"] == 2835){ SPcm[0] = "Slothasor"; }
                if(data[key]["id"] == 2831){ SPcm[1] = "Trio"; }
                if(data[key]["id"] == 2821){ SPcm[2] = "Matthias"; }
                
                //check SotF bosses
                if(data[key]["id"] == 3025){ SotFcm[0] = "Escort (Love is Bunny)"; }
                if(data[key]["id"] == 3022){ SotFcm[1] = "Escort (8 minutes)"; }
                if(data[key]["id"] == 3019){ SotFcm[2] = "Keep Construct"; }
                
                //check BotP bosses
                if(data[key]["id"] == 3334){ BotPcm[0] = "Cairn"; }
                if(data[key]["id"] == 3287){ BotPcm[1] = "Mursaat Overseer"; }
                if(data[key]["id"] == 3342){ BotPcm[2] = "Samarog"; }
                if(data[key]["id"] == 3292){ BotPcm[3] = "Deimos"; }
                
                
                if(counter == Object.keys(data).length)
                {
                    //kills formatting
                    let SV_out = "Spirit Vale: "+SV.join(", ");
                    let SP_out = "Salvation Pass: "+SP.join(", ");
                    let SotF_out = "Stronghold of the Faithful: "+SotF.join(", ");
                    let BotP_out = "Bastion of the Penitent: "+BotP.join(", ");
                    
                    //CM formatting
                    let SPcm_out = "Salvation Pass: "+SPcm.join(", ");
                    let SotFcm_out = "Stronghold of the Faithful: "+SotFcm.join(", ");
                    let BotPcm_out = "Bastion of the Penitent: "+BotPcm.join(", ");
                    
                    let output = "**Boss Kills**\n```\n"+SV_out+"\n"+SP_out+"\n"+SotF_out+"\n"+BotP_out+"```\n";
                    
                    output += "**Challenge Motes/Modes**\n```\n"+"\n"+SPcm_out+"\n"+SotFcm_out+"\n"+BotPcm_out+"\n```"
                    
                    output = output.replace(/,(\s*,)+/, ",");// removes instances of [, ,]
                    output = output.replace(/,\s\s+/,"");//removes instances where comma is trailing at the end
                    
                    message.channel.sendMessage(output);
                }
                
            }
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['Api raid progress', 'Api Raid Progress'],
  permLevel: 1
};

exports.help = {
  name: 'api raid progress',
  description: 'Shows completed boss/CM for the account.',
  usage: 'api raid progress'
};