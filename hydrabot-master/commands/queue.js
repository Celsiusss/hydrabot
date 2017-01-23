const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {

	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	//List queue
	if (queue[msg.guild.id].length != 0) {

		let queuelist = "";

		queuelist += "Currently playing: " + queue[msg.guild.id][0][1] + "\n";

		for (let i = 1; i < queue[msg.guild.id].length; i++) {
			queuelist += i + ". " + queue[msg.guild.id][i][1] + "\n";
		}
		msg.channel.sendMessage(queuelist)
				.then(msg => log(`Sent message: ${msg.content}`))
				.catch(console.error);
	} else {
		msg.channel.sendMessage("No videos in queue.")
				.then(msg => log(`Sent message: ${msg.content}`))
				.catch(console.error);
	}

};

exports.info = {
	name: "queue",
	description: "View all the songs currently in a queue.",
	usage: "queue"
};
