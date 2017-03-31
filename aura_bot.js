
const Discord = require("discord.js");
const request = require('request');
const Promise = require('bluebird');
const Feedparser = require('feedparser');
const moment = require('moment');
const fs = require('fs');
const client = new Discord.Client();


const settings = require('./files/settings.json');
const variables = require('./files/variables.json');
const functions = require("./files/functions.js");

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err);
});

require("./util/eventLoader")(client);


var timedOut = false;



const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    //log(`Loading Command: ${props.help.name}. 👌`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/

	let permlvl = 2;//2 is default level

	let banlist = require(settings.botPath+"files/banlist.json");
	let blacklist = require(settings.botPath+"files/blacklist.json");
	if(banlist.indexOf(message.author.id) !== -1){//if user is on banlist
		permlvl = 0;
	}
	else if(blacklist.indexOf(message.author.id) !== -1){//if user is on blacklist
		permlvl = 1;
	}
  //make mods and admins imune to blacklist/banlist. If you don't want this, include this in an "else"
  if(!message.guild) return permlvl;
  let mod_role = message.guild.roles.find('name', settings.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 3;
  let admin_role = message.guild.roles.find('name', settings.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 4;
  if (message.author.id === settings.ownerid) permlvl = 5;
	return permlvl;
};

client.timedOut = message => {
	if(message.channel.type === "dm") return false;
  if(timedOut === false){
		timedOut = true;
		setTimeout(function () {
			timedOut = false;
		}, variables.timeOut);	
		return false; 
	}
	else return true;
}

client.login(settings.token);