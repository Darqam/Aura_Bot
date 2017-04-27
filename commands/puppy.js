const randomPuppy = require('random-puppy');
const snekfetch = require('snekfetch');

let check = 0;

function newPic(url, cb){
    snekfetch.get(url).then( r => {
      if(r.url !== 'http://i.imgur.com/removed.png') return cb(url);
      if(check === 5) return cb(false);//arbitrary cap at 5 calls to find image
      console.log('Grabbing new puppy link due to dead image');
      randomPuppy()
        .then(pupUrl => {
          check += 1;
          newPic(pupUrl, function(callB){//recursively call this until the image is good
            return cb(callB);
          });
        });
    });
}

exports.run = (client, message) => {

randomPuppy()
  .then(url => {
    message.channel.send(url).then(msg =>{
      newPic(url, function afterUrl(newUrl){
        if(newUrl === url) return;
        if(newUrl === false) return console.log('Gave up on puppy query'); //if you couldn't find anything
        return msg.edit(newUrl);
      });
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['puppys', 'puppies', 'dog', 'doggie', 'doggy'],
  permLevel: 2,
  type: "fun"
};

exports.help = {
  name: 'puppy',
  description: 'Links a random puppy picture',
  usage: 'puppy'
};