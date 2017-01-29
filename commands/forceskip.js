const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
    log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

    if (dispatchers.get(msg.guild.id)) {
        msg.channel.sendMessage(`<@${msg.author.id}> force skipped the current song.`)
            .then(message => log(`Sent message: ${message.content}`))
            .catch(console.error);
        dispatchers.get(msg.guild.id).end();
    }

};

exports.info = {
    name: "forceskip",
    description: "Force a skip.",
    usage: "forceskip"
};
