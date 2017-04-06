const request = require('request');

let validExt = [".jpg", ".png", ".gif", ".gifv"];

exports.run = (client, message, params, perms) => {

    request("http://reddit.com/r/"+params[0]+".json", function (error, response, body) {
        body = JSON.parse(body)

        if(!error && params.length > 0 && !body.error){
            
            if(body.data.children.length < 1) return message.channel.sendMessage("Could not find info on the querried subreddit. Are you certain this was a valid link?");
            let entries = body.data.children.filter(x =>{
                if(!x.data.preview || x.data.over_18 || x.data.domain.startsWith("self") || !RegExp(validExt.join('|')).test(x.data.url)) return 0;//if there is no image preview, is over 18, is a selfpost, or doesn't contain a valid ext
                return x;
            });
            if(entries.length < 1) return message.channel.sendMessage("No valid links");

            message.channel.sendMessage(entries[Math.floor(Math.random() * entries.length)].data.url).catch(console.error);
        }
        else{
            let outErr = body.error || error;
            message.channel.sendMessage("Error Occured: "+outErr);
        }
    });
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: ['redit'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'reddit',
  description: 'Links a random image from the current top images of the selected subreddit',
  usage: 'reddit, <subreddit name>'
};