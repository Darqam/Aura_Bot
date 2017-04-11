const snekfetch = require('snekfetch');
const request = require('request');
const Promise = require('bluebird');
const Feedparser = require('feedparser');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');


const forumRss = 'https://forum-en.guildwars2.com/forum/info/updates.rss';
let api_file = "./files/api_keys.json";

var self = module.exports = {
    isApiKill: function(url, cb){
        snekfetch.get(url).then( r => {            
            if (r.status.statusCode < 200 || r.status.statusCode > 299 || r.ok == false) return console.log(r.statusText);

            try
            {
                if(r.body['text'] === "no such id"){cb(false);console.log("Bad API call.");}
                else if(r.body.error === "not found"){cb(false);console.log("hit error");}
                else if(r.body){cb(r.body);}
                
            }
            catch(err)
            {
                console.log(err.message);
                cb(false);
            }	
        });
    },

    lookupDaily: function(message, data, type, cb){
        if(data[type].length == 0) return cb("```\nNo dailies found in this section\n```");//only look things up if there are actual entries
        
        let ids = data[type].map(achiev => achiev["id"]);
        let url = "https://api.guildwars2.com/v2/achievements?ids="+ids.join(",");
        self.isApiKill(url, function onComplete(ach_arr) {
            if(ach_arr === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

            cb(`\`\`\`\n${ach_arr.map(cheevo => cheevo["name"]).join(`\n`)}\`\`\``);
        });
    },

    lookupAllDaily: function(message, data, cb){
        if(Object.keys(data).length == 0) return cb("```\nNo dailies found in this section\n```");
        
        let ids = [];
        let tracker = [];
        let names = [];
        let counter = 0;
        for(let type in data){
            if(data[type].length > 0){
                let typeIds = data[type].map( x => x.id);
                let unique = typeIds.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });
                tracker[counter] = unique.length;//set how many unique achievements
                names[counter] = type;//set section names (no hardcode in case of possible future change)
                counter += 1;
                ids = ids.concat(unique);
            }
        }
        // at this point tracker is an array of which each entry represents the section size
        // and ids hols all the ids in one array (without duplicates)

        let url = "https://api.guildwars2.com/v2/achievements?ids="+ids.join(",");
        self.isApiKill(url, function onComplete(ach_arr) {
            if(ach_arr === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

            //console.log(ach_arr);
            let index = 0;
            let count = 0;
            let output = `${names[index].toUpperCase()} Dailies: \n\n\`\`\``;

            for(let i in ach_arr){
                output += `${ach_arr[i].name}\n`;

                count += 1;
                if(count === tracker[index]){
                    count = 0;
                    index += 1;
                    output += `\`\`\``;
                    if(tracker[index]){//if we entered a new valid category
                        output += `\n\n${names[index].toUpperCase()} Dailies: \n\n\`\`\``;
                    }
                }
            }
            cb(output);
        });
    },

    getUserKey: function(message, user, cb){
        fs.readFile(api_file, 'utf8', function read(err, data){
            if (err){
                console.log(err);
                cb("");//code compliance
            }
            let content = JSON.parse(data);
            if(content[user.id]){//if there is an api key for this user
                cb(content[user.id]);
            }
            else{
                cb("");
                message.channel.sendMessage("You have not set an API key, please use the **!API KEY <key here>** command.");
            }
        });
    },

    checkReleaseNotes: function() {
        //This function was built completely by https://github.com/Archomeda
        return self.readRss(forumRss).then(reader => {
            const latestThread = reader.read();
            return self.readRss(`${latestThread.link}.rss`);
        }).then(reader => {
            const allNotes = [];
            let notes;
            while (notes = reader.read()) {
                allNotes.push(notes);
            }

            return allNotes;
        });
    },

    readRss: function(url) {
        //This function was built completely by https://github.com/Archomeda
        return new Promise((resolve, reject) => {
            const r = request(url);
            const feed = new Feedparser();
            r.on('error', reject);
            r.on('response', function(res) {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    this.pipe(feed);
                } else {
                    reject(new Error('Invalid status code ' + res.statusCode));
                }
            });
            feed.on('error', reject);
            let read = false;
            feed.on('readable', function() {
                if (!read) {
                    resolve(this);
                    read = true;
                }
            });
        });
    },

    getUserByName: function(username, message, cb){
        let found = false;
        message.guild.members.map(function(mUser){//this will cycle through all roles the member has
            if(username == mUser.displayName){
                found = true;
                cb(mUser);
            }
        });
        if(found === false){ cb(false); }
    },

    getUserById: function(Id, message, cb){
        let found = false;
        message.guild.members.map(function(mUser){//this will cycle through all roles the member has
            if(Id == mUser.id){
                found = true;
                cb(mUser);
            }
        });
        if(found === false){ cb(false); }
    },

    getBaddieList: function(location, cb){
        let userList = [];
        fs.readFile(location, 'utf8', function read(err, data){
            if (err){
                throw err;
            }
            let content = data.split('\n');//split text per line
            (function processInfo(i){
                if(i<content.length){//if we are going through the entries
                    userList.push(content[i]);
                    setTimeout(function(){ processInfo(i+1); },0);
                }
                if(i == content.length)
                {//if we got here, we done
                    cb(userList);
                }
            })(0);
        });
    },

    writeToLog: function(message, pass, logPath){
        let time = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]: `;
        let details = `${message.channel.name} (${message.channel.type})/${message.author.username} --> ${message.content}`;

        fs.appendFile(logPath, `${time}${pass}${details}\n`, function (err) {
            if (err) {
                console.log("Could not save log for: "+message.content);
            } else {
                console.log(`${chalk.bold.cyan(time)}${chalk.grey(pass)}${chalk.magenta(`${message.channel.name} (${message.channel.type})/${message.author.username}`)} --> ${chalk.green(message.content)}`);//why the hell do I do this....?
            }
        });
    }
};