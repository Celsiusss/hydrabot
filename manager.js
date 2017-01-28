const Discord = require('discord.js');
const log = require('./helpers/log');

let options = {
    token: "MjY2ODcyMDQ2OTIxNzExNjE2.C22iow.SwRYS1GRqaiU6HLrWlrat63ZTc4"
};

const Manager = new Discord.ShardingManager('./bot.js', options);

Manager.on("launch", (shard) => {
    log(`New shard spawned with a total of ${Manager.shards.size}`);
});

Manager.spawn();
