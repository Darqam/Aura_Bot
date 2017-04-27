const snekfetch = require('snekfetch');

let validExt = [".jpg", ".png", ".gif", ".gifv"];

exports.run = (client, message, params) => {
    /**********************************************************************************************************/
    /**********Please note that I have not debugged/tested this function as all, so can't guarantee it works***/
    /**********************************************************************************************************/
    snekfetch.get(`https://www.reddit.com/${params[0]}.json`).then( r => {

        if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return message.channel.send("There was a hickup somewhere along the way.");
            
        if(r.body.data.children.length < 1) return message.channel.send("Could not find info on the querried subreddit. Are you certain this was a valid link?");
        let entries = r.body.data.children.filter(x =>{
            if(!x.data.preview || x.data.over_18 || x.data.domain.startsWith("self") || !RegExp(validExt.join('|')).test(x.data.url)) return 0;//if there is no image preview, is over 18, is a selfpost, or doesn't contain a valid ext
            return x;
        });
        if(entries.length < 1) return message.channel.send("No valid links");

        message.channel.send(entries[Math.floor(Math.random() * entries.length)].data.url).catch(console.error);
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