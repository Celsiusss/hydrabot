const log = require("../helpers/log.js");

exports.run = (bot, msg, params) => {
	log(msg.author.username + " (" + msg.author.id + ") issued command: " + msg.content);
	
	//ALERT Too many if statements below
	if (msg.member.voiceChannelID && dispatchers.get(msg.guild.id)) { //Check if connected to voice
        let perc = 0.5;
        let req = Math.ceil((msg.member.voiceChannel.members.size-1) * perc);

		if (msg.member.voiceChannel.members.get(bot.user.id)) { //Check if user is in same channel as the bot
			
			if (msg.author.id === msg.guild.ownerID) { //If the owner does .skip, ignore voting
				skips[msg.guild.id] = null;
				msg.channel.sendMessage("Song skipped!")
					.then(message => log(`Sent message: ${message.content}`))
					.catch(console.error);
				dispatchers.get(msg.guild.id).end();
				return;
			}
			
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
				skips[msg.guild.id] = null;
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
