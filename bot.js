const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const bot = new Discord.Client();

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

let queue = [];
let cooldown = false;

bot.on("message", msg => {
	
	const prefix ="!";
	
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	
	//Command cooldown
	if (cooldown == true) {
		msg.channel.sendMessage("You're sending commands too quickly!")
			.then(msg => console.log(`Sent message: ${msg.content}`))
			.catch(console.error);
		return;
	}
	function setCooldown(value) {
		return cooldown = value;
	}
	setCooldown(true);
	setTimeout( () => {
		setCooldown(false);
	}, 3000);
	
	if (msg.content.startsWith(prefix + "help")) {
		msg.channel.sendMessage("" +
			"__**Help**__\n" +
			"!play URL - Adds the video to queue\n" +
			"!stop - Stops the music\n" +
			"!queue - Lists the current queue\n" +
			"!clear - Clears the current queue\n" +
			"\n" +
			"Hydra Discord channel:  https://discord.gg/UcZc3uX")
			.then(msg => console.log(`Sent message: ${msg.content}`))
			.catch(console.error);
	}
	
	//Play command
	if (msg.content.startsWith(prefix + "play")) {
		
		let args = msg.content.split(" ");
		
		if (args.length > 1) {
			if (args[1].startsWith("http://www.youtube.com/watch?v=") || //Check url
				args[1].startsWith("https://www.youtube.com/watch?v=")) {
				
				const streamOptions = {seek: 0, volume: 1};
				const voiceChannel = msg.member.voiceChannel;
				
				if (queue.length <= 0) {
					try {
						voiceChannel.join().then(connection => { //Join voice channel

							ytdl.getInfo(args[1], (err, info) => {
                                queue.push([args[1], info.title]);
                                console.log("Added url to queue " + queue[0]);

                                play(queue[0][0], connection);
							});


							
							function play(streamurl, connection) { //Play video function
								
								console.log('Playing stream ' + streamurl);
								
								const stream = ytdl(streamurl, {filter: 'audioonly'}); //Play :D
								const dispatcher = connection.playStream(stream, streamOptions);
								
								dispatcher.once("end", () => { //Called when stream ends
									queue.shift();
									if (queue.length > 0) {
										play(queue[0][0], connection); //Have no idea how this even works
									} else {
										connection.disconnect();
									}
									
									console.log("Stream ended");
								});
							}
							
						}).catch(console.error);
					} catch(e) { //I should not do it this way, but meh
						msg.channel.sendMessage("Join a voice channel before jaming")
							.then(msg => console.log(`Sent message: ${msg.content}`))
							.catch(console.error);
					}
				} else {
                    ytdl.getInfo(args[1], (err, info) => {
                        queue.push([args[1], info.title]);

                        console.log("Added url to queue " + queue[0]);
                        msg.channel.sendMessage("Added to queue: " + info.title)
                            .then(msg => console.log(`Sent message: ${msg.content}`))
                            .catch(console.error);
                    });
				}
			} else {
				msg.reply("That URL is not valid, it must be a full Youtube URL."); //If url is invalid
			}
		} else {
			msg.reply("I need a Youtube URL for that."); //If no arguments is given
		}
	}
	
	if (msg.content.startsWith(prefix + "stop")) {
		const voiceChannel = msg.member.voiceChannel;
		voiceChannel.join().then(connection => {
			connection.disconnect();
		});
		queue = [];
	}
	
	if (msg.content.startsWith(prefix + "queue")) {
		//List queue
		if (queue.length > 0) {

			let queuelist = "";
			for (let i = 0; i<queue.length; i++) {
				queuelist += i+1 + ". " + queue[i][1] + "\n";
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

    if (msg.content.startsWith(prefix + "clear")) {
		queue = [];
		msg.channel.sendMessage("Queue cleared!")
			.then(msg => console.log(`Sent message: ${msg.content}`))
            .catch(console.error);
    }
	
});

bot.login('MjY2ODU4MjM4Mzc5NTU2ODg1.C1a69Q.HmbNjQMMTfzx4Qkpi_hVULrIrqg');
