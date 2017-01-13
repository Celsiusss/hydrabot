const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = new require("youtube-search");
const bot = new Discord.Client();
const fs = new require("fs");
var cleverbot = require("cleverbot.io"),
		clever = new cleverbot("jp6wu9XZbYdoICmo", "54jV1VcMNxGQyc2cdKUFUpjkPVo3bTr2");

bot.on('ready', () => {
	bot.user.setGame(".help");
	console.log(`Logged in as ${bot.user.username}!`);
});

let searchOptions = {
	maxResults: 1,
	key: "AIzaSyCxjNMz0f-0QiU2hxOFmQTW1zEDfcuwG7g"
};

global.queue = {
	test: "test"
};
let timer = false;
let clevername = "-";

//let guildID = msg.guild.id;
//queue[guildID] = [];

bot.on("message", (msg) => {
	
	const prefix =".";
	
	if (msg.content.startsWith(prefix)) {} else if (msg.content.startsWith(clevername)) {} else return;
	if (msg.author.bot) return;

	let guildID = msg.guild.id;

	if (!queue[msg.guild.id]) {
		queue[msg.guild.id] = [];
	}

	//Command cooldown
	function cooldown() {

		if (timer == true) {
			msg.channel.sendMessage("You're sending commands too quickly!")
				.then(msg => console.log(`Sent message: ${msg.content}`))
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
		msg.channel.sendMessage("" +
			"__**Help**__\n" +
			".play URL - Adds the video to queue\n" +
			".stop - Stop the music and clear the queue\n" +
			".queue - Lists the current queue\n" +
				"-your message - Talk to cleverbot!\n" +
			"\n" +
			"Hydra Discord channel:  https://discord.gg/UcZc3uX")
			.then(msg => console.log(`Sent message: ${msg.content}`))
			.catch(console.error);
	}

	//Play command
	if (msg.content.startsWith(prefix + "play")) {
		//if (cooldown()) return;

		let args = msg.content.split(" ");

		if (args.length > 1) {
			if (!args[1].startsWith("http://www.youtube.com/watch?v=") || //Check url
				!args[1].startsWith("https://www.youtube.com/watch?v=")) {

				search(msg.content.substring(prefix.length + "play".length), searchOptions, (err, results) => {
					if (err) return console.log(err);

					args[1] = results[0].link;
					start();
				});
			} else start();

			function start() {

				const streamOptions = {seek: 0, volume: 1};
				const voiceChannel = msg.member.voiceChannel;

				if (queue[msg.guild.id].length == 0) {

					try {
						voiceChannel.join().then(connection => { //Join voice channel

							play(true, args[1], connection);

							function queueAdd(add, callback) {
								if (add == true) {
									ytdl.getInfo(args[1], (err, info) => {
										if (err) {
											console.log(err);
											msg.channel.sendMessage("Error adding song, please try again.")
													.then(msg => console.log(`Sent message: ${msg.content}`))
													.catch(console.error);
											return;
										}
										if (queue[msg.guild.id].push([args[1], info.title + " (" + timestamp(info.length_seconds) + ")"])) {
											console.log("Added url to queue " + queue[msg.guild.id][0][1]);
											msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1])
													.then(msg => console.log(`Sent message: ${msg.content}`))
													.catch(console.error);

										} else console.log("Error adding song to queue.");

										callback();
									});
								} else callback();
							}

							function play(add, streamurl, connection) { //Play video function

								console.log('Playing stream ' + streamurl);

								queueAdd(add, () => {

									msg.channel.sendMessage("Now playing: " + queue[msg.guild.id][0][1])
											.then(msg => console.log(`Sent message: ${msg.content}`))
											.catch(console.error);

									const stream = ytdl(streamurl, {filter: 'audioonly'}); //Play :D
									const dispatcher = connection.playStream(stream, streamOptions);

									dispatcher.on("end", () => { //Called when stream ends
										queue[msg.guild.id].shift();
										if (queue[msg.guild.id].length > 0) {
											play(false, queue[msg.guild.id][0][0], connection); //Have no idea how this even works
										} else {
											msg.channel.sendMessage("No more songs in queue.")
												.then(msg => console.log(`Sent message: ${msg.content}`))
												.catch(console.error);

											connection.disconnect();
										}

										console.log("Stream ended");
									});
									com();

									function com() {
										bot.once("message", (message) => {
											let end = false;

											if (message.content.startsWith(prefix + "skip")) {
												message.channel.sendMessage("Song skipped!")
													.then(message => console.log(`Sent message: ${message.content}`))
													.catch(console.error);

												end = true;
												dispatcher.end();
											}

											if (message.content.startsWith(prefix + "stop") && message.guild.id == guildID) {

												connection.disconnect();
												queue[msg.guild.id] = [];

												message.channel.sendMessage("Playback stopped.")
													.then(msg => console.log(`Sent message: ${msg.content}`))
													.catch(console.error);

												end = true;
											}
											if (!end) return com();
										});
									}

								});

							}

						}).catch(console.error);
					} catch (e) { //I should not do it this way, but meh
						msg.channel.sendMessage("Join a voice channel before jamming")
							.then(msg => console.log(`Sent message: ${msg.content}`))
							.catch(console.error);
					}
				} else {
					ytdl.getInfo(args[1], (err, info) => {
						if (err) {
							console.log(err);
							msg.channel.sendMessage("Error adding song, please try again.")
								.then(msg => console.log(`Sent message: ${msg.content}`))
								.catch(console.error);
							return;
						}
						queue[msg.guild.id].push([args[1], info.title + " (" + timestamp(info.length_seconds) + ")"]);

						console.log("Added url to queue " + queue[msg.guild.id][0]);
						msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1])
								.then(msg => console.log(`Sent message: ${msg.content}`))
								.catch(console.error);
					});
				}
			}
		} else {
			msg.reply("I need a Youtube URL for that."); //If no arguments is given
		}
	}

	if (msg.content.startsWith(prefix + "queue")) {
		//List queue
		if (queue[msg.guild.id].length != 0) {

			let queuelist = "";

			queuelist += "Currently playing: " + queue[msg.guild.id][0][1] + "\n";

			for (let i = 1; i<queue[msg.guild.id].length; i++) {
				queuelist += i + ". " + queue[msg.guild.id][i][1] + "\n";
			}
            msg.channel.sendMessage(queuelist)
                .then(msg => console.log(`Sent message: ${msg.content}`))
                .catch(console.error);
		} else {
			msg.channel.sendMessage("No videos in queue.")
					.then(msg => console.log(`Sent message: ${msg.content}`))
					.catch(console.error);
		}
	}

	if (msg.content.startsWith(prefix + "post")) {

		const DiscordBots = require('discordbots');
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMTAxMDY2NDIzMDkyMDYwMTYiLCJyYW5kIjo1OTIsImlhdCI6MTQ4NDA1NDQyN30.3XLS0U5ZztPdmo3mT0QKezUC3jSJkYGr5MtgDBiZ4Tg';
		const dbots = new DiscordBots(token);
		const botid = "266872046921711616";

		let count = bot.guilds.size;

		let stats = {
			server_count: count
		};

		dbots.postBotStats(botid, stats);
	}

	if (msg.content.startsWith(clevername)) {

		clever.setNick(msg.author.username);

		clever.create(function (err, session) {
			if (err) console.log(err);
			clever.ask(msg.content.substring(clevername.length), function (err, response) {
				if (err) console.log(err);
				msg.channel.sendMessage(response)
						.then(msg => console.log(`Sent message: ${msg.content}`))
						.catch(console.error);
			});
		});
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

bot.login('MjY2ODcyMDQ2OTIxNzExNjE2.C1D_eg.VxbvB5XXfTujvOfhFMaaAd0LmJs');
