const snekfetch = require('snekfetch');

exports.run = (client, message) => {

    snekfetch.get("https://www.reddit.com/user/316nuts/m/superaww.json").then( r => {

        if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return message.channel.sendMessage("There was a hickup somewhere along the way.");
            
        if(r.body.data.children.length < 1) return message.channel.sendMessage("Could not find info on the querried subreddit. Are you certain this was a valid link?");
        let entries = r.body.data.children.filter(x =>{
            if(!x.data.preview || x.data.over_18) return 0;//if there is no image preview, is over 18
            return x;
        });
        if(entries.length < 1) return message.channel.sendMessage("No valid links");

        message.channel.sendMessage(entries[Math.floor(Math.random() * entries.length)].data.url).catch(console.error);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['eyebleach', 'aw', 'awww', 'awwww'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'aww',
  description: 'Links a random image from a repository of cutsie images',
  usage: 'aww'
};