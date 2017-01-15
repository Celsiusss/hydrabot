const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {

	let prefix = ".";

	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	msg.channel.sendMessage("Invite link for Hydra: https://discordapp.com/oauth2/authorize?client_id=266872046921711616&scope=bot&permissions=2146958463 ")
			.then(msg => log("Sent message: " + msg.content))
			.catch(console.error);

};

exports.info = {
	name: "invite",
	description: "ives you and invite link to add Hydra to your Discord server.",
	usage: "invite"
};
