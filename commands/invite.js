exports.run = (client, message, params) => {

    let inviteChan = message.member.voiceChannel || message.guild.defaultChannel;//sets to current voice chan if in one, or default text channel if in none
    let inviteAge = 10800;//set invite for 3 hours

    if(!isNaN(parseInt(params[0]))){
        if(params[0] <= 72) inviteAge = params[0]*3600; //time is asked to be given in hours, artificial cap at 72 hours
    }

    inviteChan.createInvite({maxAge:inviteAge}).then(x => {
        message.channel.sendMessage(`The following invite is valid for ${params[0]} hours.\n${x.url}`).then(msg => {
            setTimeout(function(){msg.edit("***Invite is now expired.***");}, inviteAge*1000);//setTimout is in ms, thus times 1000
        });

    }).catch(console.err);


}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['invites', 'inv'],
  permLevel: 2,
};

exports.help = {
  name: 'invite',
  description: 'Creates an invite to your current voice channel.',
  usage: 'invite, <time>. \n<time> is the amount of time the invite will last, defaults to 3 hours. Set time to 0 to have a permanent invite. Must be only a number. The invite will default to inviting to #general if the user calling the command is in no voice channel.'
};