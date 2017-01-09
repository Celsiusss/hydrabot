const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const bot = new Discord.Client();

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

let queue = [];

bot.on("message", msg => {
	const prefix ="!";
	
	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	
	if (msg.content.startsWith(prefix + "help")) {
		msg.sendMessage("Say !play YT_URL to play music. Say !stop to stop.");
	}
	
	if (msg.content.startsWith(prefix + "play")) {
		
		let args = msg.content.split(" ");
		
		if (args.length > 1) {
			if (args[1].startsWith("http://www.youtube.com/watch?v=") ||
				args[1].startsWith("https://www.youtube.com/watch?v=")) {
				
				const streamOptions = {seek: 0, volume: 1};
				const voiceChannel = msg.member.voiceChannel;
				
				if (queue.length <= 0) {
					voiceChannel.join().then(connection => {
						queue.push(args[1]);

						play(queue[0], connection);

						function play(streamurl, connection) {

							console.log('Playing stream ' + streamurl);
                            const stream = ytdl(streamurl, {filter: 'audioonly'}); //Play :D
                            const dispatcher = connection.playStream(stream, streamOptions);

                            dispatcher.on("end", () => {
                                queue.shift();
                                if (queue.length > 0) {
                                    play(queue[0], connection);
                                } else {
                                    connection.disconnect();
                                }

                                console.log("Stream ended");
                            });
                        }
						
					}).catch(console.error);
				} else {
					queue.push(args[1]);
				}
			} else {
				msg.reply("That URL is not valid, it must be a full Youtube URL.")
			}
		} else {
			msg.reply("I need a Youtube URL for that.");
		}
	}
	
	if (msg.content.startsWith(prefix + "stop")) {
		const voiceChannel = msg.member.voiceChannel;
		voiceChannel.join().then(connection => {
			connection.disconnect();
		});
	}
	
	if (msg.content.startsWith(prefix + "queue")) {

		if (queue.length > 0) {
            msg.channel.sendMessage(queue.join("\n"))
                .then(msg => console.log(`Sent message: ${msg.content}`))
                .catch(console.error);
        } else {
            msg.channel.sendMessage("Queue is empty!")
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

bot.login('MjY2ODU4MjM4Mzc5NTU2ODg1.C1QK5A.fO2Xh4ccWD_6cCd8ef6DIzcLQp4');
