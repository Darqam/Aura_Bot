const request = require('request');

exports.run = (client, message, params, perms) => {

    request("https://www.reddit.com/user/316nuts/m/superaww.json", function (error, response, body) {
        body = JSON.parse(body)

        if(!error && !body.error){
            
            if(body.data.children.length < 1) return message.channel.sendMessage("Could not find info on the querried subreddit. Are you certain this was a valid link?");
            let entries = body.data.children.filter(x =>{
                if(!x.data.preview || x.data.over_18) return 0;//if there is no image preview, is over 18
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
  enabled: true,
  guildOnly: false,
  aliases: ['reddit'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'aww',
  description: 'Links a random image from a repository of cutsie images',
  usage: 'aww'
};