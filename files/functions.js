const https = require('https');
const request = require('request');
const Promise = require('bluebird');
const Feedparser = require('feedparser');
const moment = require('moment');
const fs = require('fs');


const forumRss = 'https://forum-en.guildwars2.com/forum/info/updates.rss';
let api_file = "./files/api_keys.json"

var self = module.exports = {
    isApiKill: function(url, cb){
        var request = https.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event 
            var buffer = "", 
                data,
                route;

            response.on("data", function (chunk) {
                buffer += chunk;
            }); 

            response.on("end", function (err) {
                // finished transferring data
                // dump the raw data
                //console.log(buffer);
                //console.log("\n");
                data = JSON.parse(buffer);
                //console.log(data)
                try
                {
                    if(data['text'] === "no such id"){cb(false);console.log("Bad API call.");}
                    else if(data.error === "not found"){cb(false);console.log("hit error");}
                    else if(data){cb(data);}
                    
                }
                catch(err)
                {
                    console.log(err.message);
                    cb(false);
                }	
            });
        });
    },

    noDups: function(myArray, cb){
        for(var key in myArray)
        {
            for(var keyB in myArray)
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
        var counter = 0;
        var ach_entry = [];
        var ach_string = "";
        var output = "```\n";
        if(data[type].length > 0)//only look things up if there are actual entries
        {
            for(var key in data[type])
            {
                counter += 1;
                ach_string += data[type][key]["id"].toString()+",";
                if(counter == Object.keys(data[type]).length){//all ids are in an array
                    var url = "https://api.guildwars2.com/v2/achievements?ids="+ach_string;
                    self.isApiKill(url, function onComplete(ach_arr) {
                        if(ach_arr === false)//if something went booboo
                        {
                            message.channel.sendMessage("Something went bad with the API call, probably a bot or API issue. The queried url was: <"+url+"> . If this url is incorrect or active, contact Daroem, he messed up.");
                        }
                        else
                        {
                            var counterB = 0;
                            for(var i in ach_arr)
                            {
                                counterB += 1;
                                output += ach_arr[i]["name"]+"\n";
                                
                                if(counterB == Object.keys(ach_arr).length)
                                {
                                    output += "```"
                                    cb(output);
                                }
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
        var counter = 0;
        var counterA = 0;
        var ach_entry = [];
        var labels = [];
        var ach_string = "";
        var output = "";
        var currentFlag = "";
        
        
        if(Object.keys(data).length > 0)//only look things up if there are actual entries
        {
            for(var keyA in data)
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
                    for(var key in data[keyA])
                    {
                        counter += 1;
                        ach_string += data[keyA][key]["id"].toString()+",";

                        if((counter == Object.keys(data[keyA]).length) && counterA == Object.keys(data).length){//all ids are in an array
                            var url = "https://api.guildwars2.com/v2/achievements?ids="+ach_string;
                            self.isApiKill(url, function onComplete(ach_arr) {
                                if(ach_arr === false)//if something went booboo
                                {
                                    message.channel.sendMessage("Something went bad with the API call, probably a bot or API issue. The queried url was: <"+url+"> . If this url is incorrect or active, contact Daroem, he messed up.");
                                }
                                else
                                {
                                    var sections = Object.keys(labels);
                                    currentFlag = "pve";
                                    var counterB = 0;
                                    var counterC = 0;
                                    var sect_track = 0;
                                    //output += "All Dailies:\n";
                                    output += "\n\n"+currentFlag.toUpperCase()+" Dailies: \n\n```";
                                    for(var i in ach_arr)
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
                                            output += "```"
                                            cb(output);
                                        }
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
            })
        });
    },

    grabMention: function(message, cb){
        var mentions = message.mentions.users;
        //var daroId = "129714945238630400";
        var allMentions = mentions.map(function(mUser){
            return mUser.id;
        });
        var allNames = mentions.map(function(mUser){
            return mUser.username;
        });
        //console.log(user.username+" sent a codec to "+allNames[0]);
        cb(allMentions[0]);//only want the first mentionned
    },

    getUserByName: function(username, message, cb){
        var found = false;
        var userList = message.guild.members;
        message.guild.members.map(function(mUser){//this will cycle through all roles the member has
            if(username == mUser.displayName){
                found = true;
                cb(mUser);
            }
        });
        if(found === false){ cb(false); }
    },

    getUserById: function(Id, message, cb){
        var found = false;
        var userList = message.guild.members;
        message.guild.members.map(function(mUser){//this will cycle through all roles the member has
            if(Id == mUser.id){
                found = true;
                cb(mUser);
            }
        });
        if(found === false){ cb(false); }
    },

    checkSModAdmin: function(message, cb){
        var found = false;
        var stuff = message.member.roles.map(function(mUser){//this will cycle through all roles the member has
            if((mUser.name === "Admin") || (mUser.name === "Super Moderator"))//look only at these two roles
            {
                cb(true);
                found = true;
            }
        });
        if(found === false){ cb(false); }
    },

    getBaddieList: function(location, cb){
        var userList = [];
        fs.readFile(location, 'utf8', function read(err, data){
            if (err){
                throw err;
            }
            var content = data.split('\n');//split text per line
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

    writeBaddieList: function(message, location, badUser, cb){
        var id_check = badUser.id;
        fs.readFile(location, 'utf8', function read(err, data){
            if (err){
                throw err;
            }
            var content = data.split('\n');//split text per line
            (function processInfo(i){
                if(i<content.length){//if we are going through the entries
                    id_check = content[i].split(": ")[0];
                    if(id_check === badUser.id){
                        message.channel.sendMessage("User is already on the list. Nothing done");
                        cb(false);
                        return;
                    }
                    else{
                        setTimeout(function(){ processInfo(i+1); },0);
                    }
                }
                if(i == content.length)
                {//if we got here, it means there was no previous entry
                    
                    fs.appendFile(location, badUser.id+'\n', function (err) {
                        if (err) {
                            message.channel.sendMessage("There was an issue in adding the user to the list.");
                        } else {
                            message.channel.sendMessage("User has been added to the list.");
                            cb(true);
                        }
                    })
                }
            })(0);
        });
    },

    removeFromBaddieList: function(message, location, goodUser, cb){

        var flag = false;
        var id_check = "";
        var length = 0;
        var content = [];
        
        fs.readFile(location, 'utf8', function read(err, data){
            if (err){
                throw err;
            }
            var tmp_arr = data.split('\n');//split text per line
            length = tmp_arr.length;
            (function processInfo(i){
                if(i<length){//if we are going through the entries
                    id_check = tmp_arr[i];
                    if(id_check === goodUser.id.toString()){
                        content.push('')//replace the user entry in the array we have saved						
                        flag = true;
                    }
                    else{ content.push(tmp_arr[i]); }
                    setTimeout(function(){ processInfo(i+1); },0);
                }
                if((i === length) && (flag == true))
                {//if we got here, we done and there is a change to be made
                    var tmpWrite = content.join("");
                    
                    var file = fs.createWriteStream(location);
                    file.on('error', function(err) { message.channel.sendMessage("There was an issue in removing user from list."); });
                    content.forEach(function(v) { if(v.trim() != "") {file.write(v + '\n'); }});
                    file.end();
                    message.channel.sendMessage("User has been succesfully removed from list.")
                }
                else if((i == content.length) && (flag == false)){ message.channel.sendMessage("Could not find the user on the list, nothing done."); }
            })(0);
        })	
    },

    writeToLog: function(message, pass, logPath){
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
        var toFile = pass+datetime+" : "+message.channel.name+"("+message.channel.type+")/"+message.author.username+" --> "+message.content;
        fs.appendFile(logPath, toFile+'\n', function (err) {
            if (err) {
                console.log("Could not save log for: "+message.content);
            } else {				
                console.log(toFile);
            }
        });
    },

    doInitChecks: function(message, cb){
        writeToLog(message);
            //check if user is banlist
        getBaddieList(banlistPath, function checkBan(banList){//banList returns array of Ids
            if(banList.includes(message.author.id)){
                console.log("Banned");
                cb("ban");
            }
            else{//user not on banlist
                getBaddieList(blacklistPath, function checkBlack(blackList){
                    if(blackList.includes(message.author.id)){
                        cb("blacklist");
                    }
                    else{
                        cb("clean");
                    }
                });
            }
        });
    }
};