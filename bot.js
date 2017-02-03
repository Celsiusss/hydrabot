require('@risingstack/trace');
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const fs = new require("fs");
const path = require("path");
const probe = require('pmx').probe();
const jsonfile = require("jsonfile");
const commandCooldown = require("./helpers/commandCooldown.js");
let cleverbot = require("cleverbot.io"),
		clever = new cleverbot("jp6wu9XZbYdoICmo", "54jV1VcMNxGQyc2cdKUFUpjkPVo3bTr2");

const log = require("./helpers/log.js");

bot.on('ready', () => {
	bot.user.setGame(".help | hydra-bot.xyz");

	(function loop (i) {
		setTimeout(function () {
			guilds.set(bot.guilds.size);
			if (true) {
				loop(i);
			}
		}, 1000);
	})(10);

	log(`Ready to serve ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);
});


global.skips = {};
global.queue = {
	test: "test"
};

global.dispatchers = new Map();
global.connections = new Map();
global.voices = new Map();
global.streams = new Map();

let config = "ERR";

global.allstreams = 0;
global.counter = probe.counter({
	name: "Streams"
});
let guilds = probe.metric({
	name: "Guilds"
});

let userCooldown = new Map();




bot.commands =  new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
	if (err) console.error(err);
	log(`Loading a total of ${files.length} commands.`);
	files.forEach(f => {
		let props = require(`./commands/${f}`);
		log(`Loading Command: ${props.info.name}. :ok_hand:`);
		bot.commands.set(props.info.name, props);
		/*
		props.conf.aliases.forEach(alias => {
			bot.aliases.set(alias, props.info.name);
		});
		*/
	});
});



bot.on("message", (msg) => {

	const prefix = ".";

	let id = bot.user.id;
	let clevername = new RegExp(`^<@!?${id}>`);

	if (msg.content.startsWith(prefix)) {} else if (clevername.test(msg.content)) {} else return;
	if (msg.author.bot) return;
	
	
	if (msg.guild) {
		if (!queue[msg.guild.id]) {
			queue[msg.guild.id] = [];
		}
	} else return;


	let command = msg.content.split(" ")[0].slice(prefix.length);
	let params = msg.content.split(" ").slice(1);
	//let perms = bot.elevation(msg);
	let cmd;

	if (!userCooldown.get(msg.author.id)) {
		userCooldown.set(msg.author.id, 0);
	}

	if (bot.commands.has(command)) {
		if (!commandCooldown(userCooldown.get(msg.author.id))) {
			userCooldown.set(msg.author.id, Date.now());
			cmd = bot.commands.get(command);
		} else msg.channel.sendMessage("You're sending commands too quickly!");

	} else if (bot.aliases.has(command)) {
		cmd = bot.commands.get(bot.aliases.get(command));
	}
	if (cmd) {
		if (command == 'makedb') {
			cmd.run(bot, msg, params);
		}
        let guildsdb = require("./models/guilds");
		guildsdb.find({guildID: msg.guild.id}, {}, {lean: true}, (err, guild) => {
			if (!guild[0]) {
				msg.channel.sendMessage("This server is not configured!\n" +
					"Ask the server owner to configure the server at http://hydra-bot.xyz/")
					.then(message => log(`Sent message: ${message.content}`))
					.catch(console.error);
				
			} else if (guild[0].guildID == msg.guild.id) {
				
				let role = msg.guild.roles.find('name', guild[0].permissions[command]);
				if (role.position <= msg.member.highestRole.position || role.name == '@everyone') {
					cmd.run(bot, msg, params);
				}
			}
		});
	}
	

	if (clevername.test(msg.content)) {
		console.log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

		let string = msg.content;
		string = msg.content.split(" ");
		string.shift();
		string.join(" ");

		clever.setNick(msg.author.username);

		clever.create(function (err, session) {
			if (err) log(err);
			clever.ask(string, function (err, response) {
				if (err) log(err);
				msg.channel.sendMessage(response)
						.then(msg => log(`Sent message: ${msg.content}`))
						.catch(console.error);
			});
		});
	}

});

bot.login(config.discordToken);
