const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {

	let prefix = ".";

	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	msg.author.sendEmbed( {
		color: 3447003,

		title: '__**Help**__',
		description: prefix + 'help - Shows this message.\n' +
		prefix + "play - Play music from Youtube or song to queue.\n" +
		prefix + "skip - Vote to skip the current song (50% voters needed to skip)\n" +
		prefix + "stop - Stops the music and clears the queue. (Owner only)\n" +
		prefix + "queue - Lists the current songs in the queue\n" +
		prefix + "stats - Show some stats about Hydra.\n" +
		prefix + "ping - See if Hydra is online.\n" +
		"@Hydra - Talk to Hydra!\n" +
		"Join Hydra's Discord Server - https://discord.gg/yxzTnWA",
		

		timestamp: new Date(),
		footer: {
			icon_url: bot.user.avatarURL,
			text: 'Hydra'
		}
	}).then(msg => log("Sent DM: help menu")).catch(console.error);
	msg.channel.sendMessage(":mailbox_with_mail:")
		.then(message => log(`Sent message: ${message.content}`))
		.catch(console.error);

};

exports.info = {
	name: "help",
	description: "Lists all the commands and usages.",
	usage: "help"
};
