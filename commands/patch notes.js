const functions = require("../files/functions.js");

exports.run = (client, message, params) => {
    //check if a history was asked
    let thread_offset = 0;//set to 0 because I doubt anyone cares about previous thread
    let details = "";
    if(params.length){ details = params[0].trim().toUpperCase(); }

    message.channel.send("Fetching RSS feed...");
    
    functions.checkReleaseNotes().then(releaseNotes => { 
        let threadRss = releaseNotes[thread_offset].meta.xmlurl;
        functions.readRss(threadRss).then(reader =>{
            let notes;
            let output = "";
            while (notes = reader.read()) {
                
                let description = notes.description;
                description = description.replace(/<br\/>/g, "\n");
                description = description.replace(/\&\#8211\;/g, "-");
                
                output = "\n"+notes.title+": "+notes.link+"\n\n```"+description+"```"+output;
                if(details !== "ALL") return message.channel.send(output);//should hit send right away if only want latest patch note
            }
            message.channel.send(output, {split:true});//split message at 2k characters if need be
            
        });
        
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['patch note','Patch notes','Patch note'],
  permLevel: 1
};

exports.help = {
  name: 'patch notes',
  description: 'Displays the latest patch notes.',
  usage: 'patch notes, <all>\nExtra Info: Using \'all\' is optional and will return the full patch notes thread.'
};