const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = new require("youtube-search");
const bot = new Discord.Client();
const fs = new require("fs");
const path = require("path");
const probe = require('pmx').probe();
const jsonfile = require("jsonfile");
var cleverbot = require("cleverbot.io"),
		clever = new cleverbot("jp6wu9XZbYdoICmo", "54jV1VcMNxGQyc2cdKUFUpjkPVo3bTr2");

bot.on('ready', () => {
	bot.user.setGame(".help");

	(function loop (i) {
		setTimeout(function () {
			//guilds.set(bot.guilds.size);
			if (true) {
				loop(i);
			}
		}, 1000);
	})(10);

	console.log(ct() + `Logged in as ${bot.user.username}!`);
});

fs.readFile("config.json", (err, data) => {
	if (err) {

		let obj = {
			discordToken: "TOKEN"
		};

		jsonfile.writeFile("config.json", obj, (err) => { console.log(err) })
	} else {
		config = require("./config.json");

		bot.login(config.discordToken);
	}
});

let searchOptions = {
	maxResults: 1,
	key: "AIzaSyCxjNMz0f-0QiU2hxOFmQTW1zEDfcuwG7g"
};

global.queue = {
	test: "test"
};

let dispatchers = new Map();
let connections = new Map();
let voices = new Map();
let streams = new Map();

let timer = false;
let config = "ERR";

//let guildID = msg.guild.id;
//queue[guildID] = [];

let counter = probe.counter({
	name: "Streams"
});
let guilds = probe.metric({
	name: "Guilds",
});

bot.on("message", (msg) => {

	const prefix = ".";

	let id = bot.user.id;
	let clevername = new RegExp(`^<@!?${id}>`);

	if (msg.content.startsWith(prefix)) {
	} else if (clevername.test(msg.content)) {
	} else return;
	if (msg.author.bot) return;

	let guildID = msg.guild.id;
	const streamOptions = {seek: 0, volume: 1};

	if (!queue[msg.guild.id]) {
		queue[msg.guild.id] = [];
	}

	//Command cooldown
	function cooldown() {

		if (timer == true) {
			msg.channel.sendMessage("You're sending commands too quickly!")
					.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
					.catch(console.error);
			return;
		}
		function setCooldown(value) {
			return timer = value;
		}

		setCooldown(true);
		setTimeout(() => {
			setCooldown(false);
		}, 3000);
		return timer;
	}

	if (msg.content.startsWith(prefix + "help")) {
		console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
		msg.channel.sendMessage("" +
				"__**Help**__\n" +
				".play URL - Adds the video to queue\n" +
				".stop - Stop the music and clear the queue\n" +
				".queue - Lists the current queue\n" +
				"@Hydra - Talk to Hydra!\n" +
				"\n" +
				"Hydra Discord channel:  https://discord.gg/UcZc3uX")
				.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
				.catch(console.error);
	}

	//Play command
	if (msg.content.startsWith(prefix + "play")) {
		console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
		//if (cooldown()) return;

		let args = msg.content.split(" ");

		if (args.length > 1) {
			if (!args[1].startsWith("http://www.youtube.com/watch?v=") || //Check url
					!args[1].startsWith("https://www.youtube.com/watch?v=")) {

				search(msg.content.substring(prefix.length + "play".length), searchOptions, (err, results) => {
					if (err) return console.log(ct() + err);

					args[1] = results[0].link;
					start(msg);
				});
			} else start(msg);

			function start(msg) {

				voices.set(guildID, msg.member.voiceChannel);

				if (queue[msg.guild.id].length == 0) {

					try {
						voices.get(guildID).join().then(connection => { //Join voice channel

							connections.set(guildID, connection);

							play(true, args[1], connections.get(guildID));

						}).catch(console.error);
					} catch (e) { //I should not do it this way, but meh
						msg.channel.sendMessage("Join a voice channel before jamming")
								.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
								.catch(console.error);
					}
				} else {
					ytdl.getInfo(args[1], (err, info) => {
						if (err) {
							console.log(ct() + err);
							msg.channel.sendMessage("Error adding song, please try again.")
									.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
									.catch(console.error);
							return;
						}
						queue[msg.guild.id].push([args[1], info.title + " (" + timestamp(info.length_seconds) + ")"]);

						console.log(ct() + "Added url to queue " + queue[msg.guild.id][0]);
						msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1])
								.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
								.catch(console.error);
					});
				}
			}
		} else {
			msg.reply("I need a Youtube URL for that."); //If no arguments is given
		}
	}

	if (msg.content.startsWith(prefix + "queue")) {
		console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
		//List queue
		if (queue[msg.guild.id].length != 0) {

			let queuelist = "";

			queuelist += "Currently playing: " + queue[msg.guild.id][0][1] + "\n";

			for (let i = 1; i < queue[msg.guild.id].length; i++) {
				queuelist += i + ". " + queue[msg.guild.id][i][1] + "\n";
			}
			msg.channel.sendMessage(queuelist)
					.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
					.catch(console.error);
		} else {
			msg.channel.sendMessage("No videos in queue.")
					.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
					.catch(console.error);
		}
	}

	if (msg.content.startsWith(prefix + "stats")) {
		console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

		const DiscordBots = require('discordbots');
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMTAxMDY2NDIzMDkyMDYwMTYiLCJyYW5kIjo1OTIsImlhdCI6MTQ4NDA1NDQyN30.3XLS0U5ZztPdmo3mT0QKezUC3jSJkYGr5MtgDBiZ4Tg';
		const dbots = new DiscordBots(token);
		const botid = "266872046921711616";

		let count = bot.guilds.size;

		let stats = {
			server_count: count
		};

		msg.channel.sendMessage("Hydra is online on " + count + " servers!")
				.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
				.catch(console.error);

		dbots.postBotStats(botid, stats);
	}

	if (clevername.test(msg.content)) {
		console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

		let string = msg.content;
		string = msg.content.split(" ");
		string.shift();
		string.join(" ");

		clever.setNick(msg.author.username);

		clever.create(function (err, session) {
			if (err) console.log(ct() + err);
			clever.ask(string, function (err, response) {
				if (err) console.log(ct() + err);
				msg.channel.sendMessage(response)
						.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
						.catch(console.error);
			});
		});
	}

	if (dispatchers.get(msg.guild.id)) {
		if (msg.content.startsWith(prefix + "skip")) {
			console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

			msg.channel.sendMessage("Song skipped!")
					.then(message => console.log(ct() + `Sent message: ${message.content}`))
					.catch(console.error);
			dispatchers.get(msg.guild.id).end();
		}


		if (msg.content.startsWith(prefix + "stop")) {
			console.log(ct() + msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);

			queue[msg.guild.id] = [];
			connections.get(msg.guild.id).disconnect();

			msg.channel.sendMessage("Playback stopped.")
					.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
					.catch(console.error);
		}
	}


	function play(add, streamurl, connection) { //Play video function
		console.log(ct() + 'Playing stream ' + streamurl);

		queueAdd(add, streamurl, () => {

			msg.channel.sendMessage("Now playing: " + queue[msg.guild.id][0][1])
					.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
					.catch(console.error);

			streams.set(guildID, ytdl(streamurl, {filter: 'audioonly'}));
			dispatchers.set(msg.guild.id, connection.playStream(streams.get(guildID), streamOptions));

			dispatchers.get(guildID).once("end", () => { //Called when stream ends

				queue[msg.guild.id].shift();
				counter.dec();

				if (queue[msg.guild.id].length > 0) {
					play(false, queue[msg.guild.id][0][0], connections.get(msg.guild.id)); //Have no idea how this even works
				} else {
					msg.channel.sendMessage("No more songs in queue.")
							.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
							.catch(console.error);

					connections.get(msg.guild.id).disconnect();
				}

				console.log(ct() + "Stream ended");
			});
			dispatchers.get(msg.guild.id).once("start", () => {
				counter.inc();
			});

		});
	}

	function queueAdd(add, url, callback) {
		if (add == true) {
			ytdl.getInfo(url, (err, info) => {
				if (err) {
					console.log(ct() + err);
					msg.channel.sendMessage("Error adding song, please try again.")
							.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
							.catch(console.error);
					return;
				}
				if (queue[msg.guild.id].push([url, info.title + " (" + timestamp(info.length_seconds) + ")"])) {
					console.log(ct() + "Added url to queue " + queue[msg.guild.id][0][1]);
					msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1])
							.then(msg => console.log(ct() + `Sent message: ${msg.content}`))
							.catch(console.error);

				} else console.log(ct() + "Error adding song to queue.");

				callback();
			});
		} else callback();
	}
	
	function timestamp(time) {
		let minutes = Math.floor(time / 60);
		let seconds = time - minutes * 60;
		function str_pad_left(string,pad,length) {
			return (new Array(length+1).join(pad)+string).slice(-length);
		}
		return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
	}
	
});

function pad(d) {
	return (d < 10) ? '0' + d.toString() : d.toString();
}

function ct() {
	let date = new Date();

	let h = pad(date.getHours());
	let m = pad(date.getHours());
	let s = pad(date.getSeconds());

	return "[" + h + ":" + m + ":" + s + "] "
}
