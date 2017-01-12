const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = new require("youtube-search");
const bot = new Discord.Client();
const fs = new require("fs");

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

let searchOptions = {
	maxResults: 1,
	key: "AIzaSyCxjNMz0f-0QiU2hxOFmQTW1zEDfcuwG7g"
};

let queue = [];
let timer = false;

bot.on("message", (msg) => {
	
	const prefix =".";
	
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	
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
				
				if (queue.length <= 0) {
					
					try {
						voiceChannel.join().then(connection => { //Join voice channel
							
							play(true, args[1], connection);
							
							function queueAdd(add, callback) {
								if (add == true) {
									ytdl.getInfo(args[1], (err, info) => {
										queue.push([args[1], info.title, info.length_seconds]);
										console.log("Added url to queue " + queue[0] + "(" + timestamp(info.length_seconds) + ")");
										
										if (queue.length > 1) {
											msg.channel.sendMessage("Song added to queue: " + queue[0][1] + " (" + timestamp(info.length_seconds) + ")")
												.then(msg => console.log(`Sent message: ${msg.content}`))
												.catch(console.error);
										}
										callback();
									});
								} else {
									callback();
								}
							}
							
							function play(add, streamurl, connection) { //Play video function
								
								console.log('Playing stream ' + streamurl);
								
								queueAdd(add, () => {
									
									ytdl.getInfo(args[1], (err, info) => {
										msg.channel.sendMessage("Now playing: " + queue[0][1] + " (" + timestamp(info.length_seconds) + ")")
											.then(msg => console.log(`Sent message: ${msg.content}`))
											.catch(console.error);
									});
									
									const stream = ytdl(streamurl, {filter: 'audioonly'}); //Play :D
									const dispatcher = connection.playStream(stream, streamOptions);
									
									dispatcher.on("end", () => { //Called when stream ends
										queue.shift();
										if (queue.length > 0) {
											play(false, queue[0][0], connection); //Have no idea how this even works
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
											
											if (message.content.startsWith(prefix + "stop")) {
												end = false;
												
												connection.disconnect();
												queue = [];
												
												message.channel.sendMessage("Playback stopped.")
													.then(msg => console.log(`Sent message: ${message.content}`))
													.catch(console.error);
												
												end = true;
											} else if (!end) return com();
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
						queue.push([args[1], info.title]);
						ytdl.getInfo(args[1], (err, info) => {
							console.log("Added url to queue " + queue[0] + "(" + timestamp(info.length_seconds) + ")");
							msg.channel.sendMessage("Song added to queue: " + info.title + " (" + timestamp(info.length_seconds) + ")")
								.then(msg => console.log(`Sent message: ${msg.content}`))
								.catch(console.error);
						});
					});
				}
			}
		} else {
			msg.reply("I need a Youtube URL for that."); //If no arguments is given
		}
	}
	
	if (msg.content.startsWith(prefix + "queue")) {
		//List queue
		if (queue.length > 0) {

			let queuelist = "";
			
			queuelist += "Currently playing: " + queue[0][1] + "\n";
			
			for (let i = 1; i<queue.length; i++) {
				queuelist += i + ". " + queue[i][1] + "\n";
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
	
	function timestamp(time) {
		let minutes = Math.floor(time / 60);
		let seconds = time - minutes * 60;
		function str_pad_left(string,pad,length) {
			return (new Array(length+1).join(pad)+string).slice(-length);
		}
		return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
	}
	
});

bot.login('MjY2ODU4MjM4Mzc5NTU2ODg1.C1kmiw.WFaYryYUx5gP-YSP5FHGRf4z84E');
