const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
    log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

    msg.channel.sendMessage(`:ping_pong: Pong!`)
        .then(msg => log(`Sent message: ${msg.content}`))
        .catch(console.error);
};

exports.info = {
    name: "ping",
    description: "Pong!",
    usage: "ping"
};
