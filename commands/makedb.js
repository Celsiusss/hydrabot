const mongoose = require("mongoose");
const log = require('../helpers/log')
let Schema = mongoose.Schema;
let guildsdb = require("../models/guilds");

exports.run = (bot, msg) => {
	let guildId = msg.guild.id;
	let data = {
		guildID: guildId,
		config: {
			prefix: '.',
			ping: ':ping_pong: Pong! Hydra is online'
		},
		permissions: {
			forceskip: 'mod',
			help: '@everyone',
			invite: '@everyone',
			ping: '@everyone',
			play: '@everyone',
			queue: '@everyone',
			skip: '@everyone',
			stats: '@everyone',
			stop: 'admin'
		}
	};
	
	let guild = new guildsdb(data);
	guild.save( (err, data) => {
		if (err) log(err);
		log('made entry');
	});
	
};

exports.info = {
	name: "makedb",
	description: "insert.",
	usage: "makedb"
};
