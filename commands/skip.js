const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

	if (dispatchers.get(msg.guild.id)) {
		if (!skip[msg.guild.id] || skip[msg.guild.id] === 0) {
			skip[msg.guild.id] = 1;
		} else {
			skip[msg.guild.id]++;
		}

		if (skip[msg.guild.id] === (Math.floor(voices.get(msg.guild.id).members.array().filter(m => !m.user.bot) / 2) || 1)) {
			msg.channel.sendMessage("Skip limit reached, skipping...")
				.then(message => log(`Sent message: ${message.content}`))
				.catch(console.error);
			dispatchers.get(msg.guild.id).end();
			skip[msg.guild.id] = 0
		} else {
			msg.channel.sendMessage("Added one to current skip count. Skip count is now **" + skip[msg.guild.id] + "**.")
				.then(message => log(`Sent message: ${message.content}`))
				.catch(console.error);
		}
	}

};

exports.info = {
	name: "skip",
	description: "Skips the current song.",
	usage: "skip"
};
