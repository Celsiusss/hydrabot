const log = require("../helpers/log.js");
const config = require("../config.json");

exports.run = (bot, msg, params) => {
	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

	const DiscordBots = require('discordbots');
	const token = config.discordBotsToken;
	const dbots = new DiscordBots(token);
	const botid = config.discordBotsID;

	let count = bot.guilds.size;


	let stats = {
		server_count: count
	};

	msg.channel.sendMessage(`Hydra is aware of ${bot.users.size} users, in ${bot.channels.size} channels in ${count} servers with currently ${allstreams} streams playing right now!`)
			.then(msg => log(`Sent message: ${msg.content}`))
			.catch(console.error);

	dbots.postBotStats(botid, stats);
};

exports.info = {
	name: "stats",
	description: "View some stats!",
	usage: "stats"
};
