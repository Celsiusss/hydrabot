const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

	if (dispatchers.get(msg.guild.id)) {
		msg.channel.sendMessage("Song skipped!")
				.then(message => log(`Sent message: ${message.content}`))
				.catch(console.error);
		dispatchers.get(msg.guild.id).end();
	}

};

exports.info = {
	name: "skip",
	description: "Skips the current song.",
	usage: "skip"
};
