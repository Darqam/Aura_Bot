const settings = require('../files/settings.json');
exports.run = (client, message, params, perms) => {
  if (!params[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let modHelp = [];
    let funHelp = [];
    let sendOut = `= Command List =\n\n[Use ${settings.prefix}help, <commandname> for details]\n\n`;
    sendOut += client.commands.filter(function(c){//first only show the commands you are authorized to see
      if(c.conf.enabled === false) return;
      if(c.conf.permLevel <= 2 && c.conf.type !== "fun"){//split these up to have a separate mod help menu below
        return c;
      }
      else if (c.conf.permLevel > 2 && perms > 2){//filter out only commands requiring lvl 3+ perms (i.e mod+admin) and make sure user has those perms
        modHelp.push(c);
        return;
      }
      else if(c.conf.type === "fun" && perms > 1){//filter out only commands requiring lvl 2+ perms and make sure user has those perms
        funHelp.push(c);
        return;
      }
      else { return; }
    }).map(function(obj) { return `${settings.prefix}${obj.help.name}${' '.repeat(longest - obj.help.name.length)} :: ${obj.help.description}`; }).join('\n');//then map the commands to a usable array format and join them into a string
    
    if(funHelp.length > 0){//only output this snippet if user has rights to use these commands
      sendOut += `\n\n== Playground Commands ==\n\n`;
      sendOut += funHelp.map(function(obj) { return `${settings.prefix}${obj.help.name}`;}).join(',');
    }
    if(modHelp.length > 0){//only output this snippet if user has mod rights
      sendOut += `\n\n== Mod Commands ==\n\n`;
      sendOut += modHelp.map(function(obj) { return `${settings.prefix}${obj.help.name}${' '.repeat(longest - obj.help.name.length)} :: ${obj.help.description}`; }).join('\n');//then map the commands to a usable array format and join them into a string
    }
    message.author.send(sendOut, {code: 'asciidoc'});
    message.reply("Sent you a DM with information.");
    

  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if(perms >= command.conf.permLevel){//only show details if user has proper perm level
        message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}`, {code: 'asciidoc'});
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 1
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help, <command>\nExtra Info: Calling help with a command will show extra info for the command. With no commands it will list all commands.'
};
