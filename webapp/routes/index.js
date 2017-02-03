let express = require('express');
let router = express.Router();
const guildsdb = require('../../models/guilds');

/* GET home page. */
router.get('/', function(req, res, next) {
	guildsdb.find({guildID: '266859494833651712'}, {}, {lean: true}, (err, docs) => {
		res.render('index', {title: 'Hello World', ping: docs[0].config.ping});
	});
});

module.exports = router;
