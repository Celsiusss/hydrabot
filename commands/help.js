const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {

	let prefix = ".";

	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	msg.channel.sendEmbed( {
		color: 3447003,

		title: '__**Help**__',
		description: prefix + 'help - Shows this message.\n' +
		prefix + "play - Play music from Youtube or song to queue.\n" +
		prefix + "skip - Skip the current song and play the next one in the queue\n" +
		prefix + "stop - Stops the music and clears the queue.\n" +
		prefix + "queue - Lists the current songs in the queue\n" +
		prefix + "stats - Show some stats about Hydra.\n" +
		prefix + "invite - Gives you and invite link to add Hydra to your Discord server.",

		timestamp: new Date(),
		footer: {
			icon_url: bot.user.avatarURL,
			text: 'Hydra'
		}
	})
			.then(msg => log("Sent message: " + msg.content))
			.catch(console.error);

};

exports.info = {
	name: "help",
	description: "Lists all the commands and usages.",
	usage: "help"
};
