const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	let perc = 0.5;
	let req = 2;//Math.ceil((msg.member.voiceChannel.members.size-1) * perc);
	
	//ALERT Too many if statements below
	if (msg.member.voiceChannelID) { //Check if connected to voice
		if (msg.member.voiceChannel.members.get(bot.user.id)) { //Check if user is in same channel as the bot
			if (skips[msg.guild.id]) { //Check if the array is empty or not
				if (skips[msg.guild.id].indexOf(msg.author.id) === -1) { //If it's not empty, check if the user is not in the array
					skips[msg.guild.id].push(msg.author.id); //If not, add the user to the array
					++skips[msg.guild.id][0];
					msg.channel.sendMessage(`<@${msg.author.id}> has voted to skip (${skips[msg.guild.id][0]}/${req})`)
						.then(message => log(`Sent message: ${message.content}`))
						.catch(console.error);
				}
			} else { //The array is empty
				skips[msg.guild.id] = [1, msg.author.id]; //Add the first vote with the user
				msg.channel.sendMessage(`<@${msg.author.id}> has started a vote to skip the current song (${skips[msg.guild.id][0]}/${req})`)
					.then(message => log(`Sent message: ${message.content}`))
					.catch(console.error);
			}
			if (skips[msg.guild.id][0] >= req) {
				skips[msg.guild.id] = [];
				msg.channel.sendMessage("Song skipped!")
					.then(message => log(`Sent message: ${message.content}`))
					.catch(console.error);
				dispatchers.get(msg.guild.id).end();
			}
		}
	}

};

exports.info = {
	name: "skip",
	description: "Skips the current song.",
	usage: "skip"
};
