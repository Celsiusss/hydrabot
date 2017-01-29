const Discord = require('discord.js');
const fs = new require("fs");
const jsonfile = require("jsonfile");
const mongoose = require("mongoose");
const log = require('./helpers/log');

fs.readFile("config.json", (err, data) => {
    if (err) {
        log("Config file does not exist, creating one.");

        let obj = {
            discordToken: "TOKEN",
            discordBotsToken: "TOKEN",
        };

        jsonfile.spaces = 4;
        jsonfile.writeFile("config.json", obj, (err) => { console.log(err) });
        process.exit(1);
    } else {
        global.config = require("./config.json");


        let options = {
            token: config.discordToken
        };

        const Manager = new Discord.ShardingManager('./bot.js', options);

        Manager.on("launch", (shard) => {
            log(`New shard spawned with a total of ${Manager.shards.size}`);
        });

        Manager.spawn();
    }
});

