const settings = require('../files/settings.json');
const functions = require("../files/functions.js");

function add(a, b) {//shhhh, don't question it
    return a + b;
}

exports.run = (client, message) => {   
    //I need to learn more about asynchronous JS to do this since I am gathering from 4 zones and need them synched
    message.channel.send("Give me a few moments, looking that up.");
    let url = "https://api.guildwars2.com/v2/guild/"+settings.guildID+"/treasury"+settings.userToken;
    functions.isApiKill(url, function forTreasure(data){
        if(data === false) return message.channel.send("API is on :fire:, please wait for the :fire_engine: to arrive.");

        //first store item_ids in array
        //go into needed_by, loop over objects and add count
        let item_needed = [];
        let item_id = data.map(x => {
            let tmp = x.needed_by.map(z => {return z.count;});//get the individual counts
            item_needed.push(tmp.reduce(add, 0) - x.count);//sum up all needed counts together (using reduce), and then subtract what is already in treasury
            return x.item_id;//return the item_id
        });

        url = "https://api.guildwars2.com/v2/items?ids="+item_id.join(",");
        functions.isApiKill(url, function forTreasure(dataB){
            if(dataB === false) return message.channel.send("API is on :fire:, please wait for the :fire_engine: to arrive.");

            let item_names = dataB.map(y => {return y.name;});
            if(item_names.length !== item_needed.length) return message.channel.send("Something went bad with data lookup.");

            const longest = item_names.reduce((long, str) => Math.max(long, str.length), 0);

            let out_arr = [];
            item_names.filter((elem, index) => {
                if(item_needed[index] !== 0){
                    let spacing = '\t'.repeat((longest - elem.length)/4)+' '.repeat((longest - elem.length)%4);//need to be fancy to limit amount of characters used.
                    out_arr.push(elem.trim()+spacing+" :: "+item_needed[index]);//push pretty format into out_arr
                }
            });
            out_arr.sort();//make alphabetical
            out_arr.unshift("Name => Amount Needed\n---------------------------");//adding message header
            message.channel.sendCode('asciidoc',out_arr).catch(console.error);//looks pretty with sendCode
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
  name: 'treasury',
  description: 'Shows the current needs for the guild treasury',
  usage: 'treasury'
};