const Discord = require('discord.js');
const log = require('./helpers/log');

const Manager = new Discord.ShardingManager('./bot.js');

Manager.on("launch", (shard) => {
    log(`New shard spawned with a total of ${Manager.shards.size}`);
});

Manager.spawn();
