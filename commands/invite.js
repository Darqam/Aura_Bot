exports.run = (client, message, params, perms) => {

    let inviteChan = message.member.voiceChannel || message.guild.defaultChannel;//sets to current voice chan if in one, or default text channel if in none
    let inviteAge = 10800;//set invite for 3 hours
    inviteChan.createInvite({maxAge:inviteAge}).then(x => {
        message.channel.sendMessage(x.url).then(msg => {
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
  description: 'Creates a 3 hour invite to your current voice channel.',
  usage: 'invite. Will default to inviting to #general if the user calling the command is in no voice channel.'
};