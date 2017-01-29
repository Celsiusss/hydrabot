const log = require("../helpers/log.js");
let guildsdb = require("../models/guilds");

exports.run = (bot, msg, params) => {
    log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

    guildsdb.find({guildID: msg.guild.id}, {}, {lean: true}, (err, docs) => {
        msg.channel.sendMessage(docs[0].config.ping)
            .then(msg => log(`Sent message: ${msg.content}`))
            .catch(console.error);
    });

};

exports.info = {
    name: "ping",
    description: "Pong!",
    usage: "ping"
};
