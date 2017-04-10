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

    noDups: function(myArray, cb){
        //let y = new Set(myArray); myArray.length ==y.size; //returns false for duplicate
        for(let key in myArray)
        {
            for(let keyB in myArray)
            {
                if (key != keyB) 
                {
                    //console.log(myArray[key]["id"]+' -> '+myArray[keyB]["id"]);
                    if (myArray[key]["id"] == myArray[keyB]["id"]) 
                    {
                        //console.log(myArray[key]["id"]+' -> '+myArray[keyB]["id"]);
                        cb(false); // means there are duplicate values
                        return;//break out now or get duplicate hits
                    }
                }
            }
        }
        cb(true); // means there are no duplicate values.
    },

    lookupDaily: function(message, data, type, cb){
        let counter = 0;
        let ach_string = "";
        let output = "```\n";
        if(data[type].length > 0)//only look things up if there are actual entries
        {
            for(let key in data[type])
            {
                counter += 1;
                ach_string += data[type][key]["id"].toString()+",";
                if(counter == Object.keys(data[type]).length){//all ids are in an array
                    let url = "https://api.guildwars2.com/v2/achievements?ids="+ach_string;
                    self.isApiKill(url, function onComplete(ach_arr) {
                        if(ach_arr === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

                        let counterB = 0;
                        for(let i in ach_arr)
                        {
                            counterB += 1;
                            output += ach_arr[i]["name"]+"\n";
                            
                            if(counterB == Object.keys(ach_arr).length)
                            {
                                output += "```";
                                cb(output);
                            }
                        }
                    });
                }
            }
        }
        else
        {
            cb("```\nNo dailies found in this section\n```");
        }
    },

    lookupAllDaily: function(message, data, cb){
        let counter = 0;
        let counterA = 0;
        let labels = [];
        let ach_string = "";
        let output = "";
        let currentFlag = "";
        
        
        if(Object.keys(data).length > 0)//only look things up if there are actual entries
        {
            for(let keyA in data)
            {
                var uniqueness = true;
                counterA += 1;
                counter = 0;
                
                labels[keyA] = data[keyA].length;//should check here is array has duplicate, if it does, --
                
                
                self.noDups(data[keyA], function confirmSize(uniqueness){
                    if(uniqueness === false){//duplicate acheivs found, reduce one to length since dup achievs only shown as 1
                        labels[keyA] -= 1;
                    }

                    if(data[keyA].length == 0)//super hacky way of skipping empty categories (special/festival)
                    {
                        data[keyA][0] = {"id": 0};
                    }
                    for(let key in data[keyA])
                    {
                        counter += 1;
                        ach_string += data[keyA][key]["id"].toString()+",";

                        if((counter == Object.keys(data[keyA]).length) && counterA == Object.keys(data).length){//all ids are in an array
                            let url = "https://api.guildwars2.com/v2/achievements?ids="+ach_string;
                            self.isApiKill(url, function onComplete(ach_arr) {
                                if(ach_arr === false) return message.channel.sendMessage("API is on :fire:, please wait for the :fire_engine: to arrive.");

                                let sections = Object.keys(labels);
                                currentFlag = "pve";
                                let counterB = 0;
                                let counterC = 0;
                                let sect_track = 0;
                                //output += "All Dailies:\n";
                                output += "\n\n"+currentFlag.toUpperCase()+" Dailies: \n\n```";
                                for(let i in ach_arr)
                                {
                                    counterB += 1;
                                    
                                    if(counterC == labels[currentFlag]){//if we've gone through as many entries as we expect per game type
                                        counterC = 0;
                                        sect_track += 1;
                                        currentFlag = sections[sect_track];
                                        output += "```\n\n"+currentFlag.toUpperCase()+" Dailies: \n\n```";
                                    }
                                    counterC += 1;
                                    
                                    output += ach_arr[i]["name"]+"\n";
                                    
                                    if(counterB == Object.keys(ach_arr).length)//if we have treated every singly id
                                    {
                                        output += "```";
                                        cb(output);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
        else
        {
            cb("```\nNo dailies found in this section\n```");
        }
    },

    getUserKey: function(message, user, cb){
        fs.readFile(api_file, 'utf8', function read(err, data){
            if (err){
                throw err;
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
                console.log(`${chalk.bold.cyan(time)}${chalk.grey(pass)}${chalk.green(details)}`);			
            }
        });
    }
};