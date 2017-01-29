const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let url = "mongodb://localhost:27017/hydrabot";
mongoose.connect(url);

let guildsSchema = new Schema({
    guildID: String
});
let guilds = mongoose.model('guilds', guildsSchema);

module.exports = guilds;
