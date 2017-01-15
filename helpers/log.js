const moment = require("moment");
module.exports = exports = (msg) => {
	console.log(`[${moment().format("HH:mm:ss")}] ${msg}`);
};
