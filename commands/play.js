const search = new require("youtube-search");
const ytdl = require('ytdl-core');
const log = require("../helpers/log.js");
const play = require("../helpers/play.js");
const timestamp = require("../helpers/timestamp.js");

exports.run = (bot, msg, params) => {

	let prefix = ".";

	let guildID = msg.guild.id;

	let searchOptions = {
		maxResults: 1,
		key: "AIzaSyCxjNMz0f-0QiU2hxOFmQTW1zEDfcuwG7g"
	};

	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	//if (cooldown()) return;

	if (params[0]) {
		if (!params[0].startsWith("http://www.youtube.com/watch?v=") || //Check url
				!params[0].startsWith("https://www.youtube.com/watch?v=")) {

			search(msg.content.substring(prefix.length + "play".length), searchOptions, (err, results) => {
				if (err) return log(err);

				params[0] = results[0].link;
				start(msg);
			});
		} else start(msg);

		function start(msg) {

			voices.set(guildID, msg.member.voiceChannel);

			if (queue[msg.guild.id].length == 0) {

				try {
					if (voices.get(guildID).joinable) {
						try {
                            voices.get(guildID).join().then(connection => { //Join voice channel

                                connections.set(guildID, connection);

                                play(msg, true, params[0], connections.get(guildID));

                            }).catch(console.error);
                        } catch (e) {
							log(e);
                            msg.channel.sendMessage("An unknown error occurred while I was trying to join your channel, try again maybe?");
						}
					} else {
						msg.channel.sendMessage("I do not have permission to join your voice channel :(")
								.then(msg => log(`Sent message: ${msg.content}`))
								.catch(console.error);
					}
				} catch (e) { //I should not do it this way, but meh
					msg.channel.sendMessage("Join a voice channel before jamming")
							.then(msg => log(`Sent message: ${msg.content}`))
							.catch(console.error);
				}
			} else {
				ytdl.getInfo(params[0], (err, info) => {
					if (err) {
						log(err);
						msg.channel.sendMessage("Error adding song, please try again.")
								.then(msg => log(`Sent message: ${msg.content}`))
								.catch(console.error);
						return;
					}
					queue[msg.guild.id].push([params[0], info.title + " (" + timestamp(info.length_seconds) + ")"]);

					log("Added url to queue " + queue[msg.guild.id][0]);
					msg.channel.sendMessage("Song added to queue: " + queue[msg.guild.id][queue[msg.guild.id].length - 1][1]) //lol wut
							.then(msg => log(`Sent message: ${msg.content}`))
							.catch(console.error);
				});
			}
		}
	} else {
		msg.channel.sendMessage("Usage: " + exports.info.usage)
				.then(msg => log(`Sent message: ${msg.content}`))
				.catch(console.error);
	}

};

exports.info = {
	name: "play",
	description: "Play a song, or add it to the queue if there's already one playing.",
	usage: "play < URL / search query >"
};
