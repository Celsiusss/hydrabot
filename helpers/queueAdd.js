const ytdl = require('ytdl-core');
const timestamp = require("./timestamp.js");
const log = require("./log.js");

module.exports = exports = (msg, add, url, callback) => {
	if (add == true) {
		ytdl.getInfo(url, (err, info) => {
			if (err) {
				log(err);
				msg.channel.sendMessage("Error adding song, please try again.")
						.then(msg => log(`Sent message: ${msg.content}`))
						.catch(console.error);
				return;
			}
			if (queue[msg.guild.id].push([url, info.title + " (" + timestamp(info.length_seconds) + ")"])) {
				log("Added url to queue " + queue[msg.guild.id][0][1]);
				msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1])
						.then(msg => log(`Sent message: ${msg.content}`))
						.catch(console.error);

			} else log("Error adding song to queue.");

			callback();
		});
	} else callback();
};
