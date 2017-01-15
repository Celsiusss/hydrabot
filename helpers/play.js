const log = require("./log.js");
const play = require("./play.js");
const queueAdd = require("./queueAdd.js");
const ytdl = require("ytdl-core");

module.exports = exports = (msg, add, streamurl, connection) => {
	go(msg, add, streamurl, connection);
	function go(msg, add, streamurl, connection) {

		log('Playing stream ' + streamurl);

		let guildID = msg.guild.id;

		queueAdd(msg, add, streamurl, () => {

			msg.channel.sendMessage("Now playing: " + queue[msg.guild.id][0][1])
					.then(msg => log(`Sent message: ${msg.content}`))
					.catch(console.error);

			const streamOptions = {seek: 0, volume: 1};

			streams.set(guildID, ytdl(streamurl, {filter: 'audioonly'}));
			dispatchers.set(msg.guild.id, connection.playStream(streams.get(guildID), streamOptions));

			dispatchers.get(guildID).once("end", () => { //Called when stream ends

				queue[msg.guild.id].shift();
				allstreams -= 1;
				counter.dec();

				if (queue[msg.guild.id].length > 0) {
					go(msg, false, queue[msg.guild.id][0][0], connections.get(msg.guild.id)); //Have no idea how this even works
				} else {
					msg.channel.sendMessage("No more songs in queue.")
							.then(msg => log(`Sent message: ${msg.content}`))
							.catch(console.error);

					connections.get(msg.guild.id).disconnect();
				}

				log("Stream ended");
			});
			dispatchers.get(msg.guild.id).once("start", () => {
				counter.inc();
				allstreams += 1;
			});

		});
	}
};
