const Discord = require("discord.js");
const functions = require("../files/functions.js");
const jsonData = require('../files/data.json');
const stripIndent = require("common-tags/lib/stripIndent");

function sendEmbed(message, jsonData){
    const embed = new Discord.RichEmbed()
        .setTitle(`${message.guild ? message.member.displayName : message.author.username}'s Money count`)
        .setDescription('A quick overview of your GW2 wallet.')
        .setColor(0xf44842)
        .setThumbnail(message.author.avatarURL)
        .addField("Basic Currencies",stripIndent`
        Coins: ${jsonData["currencies"]["1"].amount}
        Karma: ${jsonData["currencies"]["2"].amount}
        Laurels: ${jsonData["currencies"]["3"].amount}
        Gems: ${jsonData["currencies"]["4"].amount}
        Transmutation Charges: ${jsonData["currencies"]["18"].amount}
        Spirit Shards: ${jsonData["currencies"]["23"].amount}
        Guild Commendations: ${jsonData["currencies"]["16"].amount}
        Provisioner Tokens: ${jsonData["currencies"]["29"].amount}`)
        .addField("Map Currencies", stripIndent`
        Geodes: ${jsonData["currencies"]["25"].amount}
        Bandit Crests: ${jsonData["currencies"]["27"].amount}
        Airship Part: ${jsonData["currencies"]["19"].amount}
        Lump of Aurillium: ${jsonData["currencies"]["22"].amount}
        Ley Line Crystal: ${jsonData["currencies"]["20"].amount}
        Magnetite Shards: ${jsonData["currencies"]["28"].amount}
        Unbound Magic: ${jsonData["currencies"]["32"].amount}`)
        .addField("Competitive Currencies", stripIndent`
        Badges of Honor: ${jsonData["currencies"]["15"].amount}
        Proof of Heroics: ${jsonData["currencies"]["31"].amount}
        PvP League Ticket: ${jsonData["currencies"]["30"].amount}
        Ascended Shards of Glory: ${jsonData["currencies"]["33"].amount}
        WvW Tournament Claim Ticket: ${jsonData["currencies"]["26"].amount}`)
        .addField("Dungeon Currencies",stripIndent`
        Ascalonian Tears: ${jsonData["currencies"]["5"].amount}
        Seals of Beetletun: ${jsonData["currencies"]["9"].amount}
        Deadly Blooms: ${jsonData["currencies"]["11"].amount}
        Manifestos of the Moletariate: ${jsonData["currencies"]["10"].amount}
        Flame Legion Charr Carvings: ${jsonData["currencies"]["13"].amount}
        Knowledge Crystals: ${jsonData["currencies"]["14"].amount}
        Symbols of Koda: ${jsonData["currencies"]["12"].amount}
        Shards of Zhaitan: ${jsonData["currencies"]["6"].amount}
        Fractal Relics: ${jsonData["currencies"]["7"].amount}
        Pristine Fractal Relics: ${jsonData["currencies"]["24"].amount}`);
    message.channel.send({embed}).catch(console.log);
}

exports.run = (client, message, params) => {
    functions.getUserKey(message, message.author, function onComplete(user_key){
        if(user_key === "") return;//handle message is sent in getUserKey function
        let url = "https://api.guildwars2.com/v2/account/wallet?access_token="+user_key;
        functions.isApiKill(url, function afterUrl(data){
            if(data === false) return message.channel.send("API is on :fire:, please wait for the :fire_engine: to arrive.");

            if(params[0]){
                for(let entry in data){
                    if(jsonData["currencies"][data[entry].id].name.toLowerCase() === params[0].toLowerCase() || jsonData["currencies"][data[entry].id].name.toLowerCase()+'s' === params[0].toLowerCase())
                        return message.reply(`You have a total of ${data[entry].value} ${params[0]}`);
                }
                return message.reply("Could not find the specified currency.");
            }

            for(let entry in data){
                jsonData["currencies"][data[entry].id].amount = data[entry].value;
            }

            sendEmbed(message, jsonData);//function call because screw async
        });
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['money', 'api money', 'api currencies'],
  permLevel: 2,
};

exports.help = {
  name: 'api currency',
  description: 'Returns information on all account currencies, or the specified currency',
  usage: 'api currency, <currencyName>\nExtra Info: \'currencyName\' is optional.'
};