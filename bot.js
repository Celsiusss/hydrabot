const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const bot = new Discord.Client();

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.username}!`);
});

bot.on("message", msg => {
	const prefix ="!";

	if (!msg.content.startsWith(prefix)) return;
	if (msg.author.bot) return;
	
	if (msg.content.startsWith(prefix + "help")) {
		msg.reply("Say !yt play YT_URL to play music. Say !yt stop to stop.");
	}
	
	if (msg.content.startsWith(prefix + "play")) {
		
		const args = msg.content.split(" ");
		
		if (args.length > 1) {
			const streamOptions = {seek: 0, volume: 1};
			const voiceChannel = msg.member.voiceChannel;

			voiceChannel.join().then(connection => {

				const stream = ytdl(args[2], {filter: 'audioonly'}); //PLay :D
				const dispatcher = connection.playStream(stream, streamOptions);
			}).catch(console.error);

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
	
});

bot.on("end", () => {
	bot.msg
});

bot.login('MjY2ODU4MjM4Mzc5NTU2ODg1.C1HblQ.006LRe5q8dtLbRiZtq6vX7Vu-Jo');
