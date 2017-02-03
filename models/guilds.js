const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let url = "mongodb://localhost:27017/hydrabot";
mongoose.connect(url);

let guildsSchema = new Schema({
    guildID: String,
	config: {
		prefix: String,
		ping: String
	},
	permissions: {
		forceskip: String,
		help: String,
		invite: String,
		ping: String,
		play: String,
		queue: String,
		skip: String,
		stats: String,
		stop: String
	}
});
let guilds = mongoose.model('guilds', guildsSchema);

module.exports = guilds;
