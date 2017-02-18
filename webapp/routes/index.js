let express = require('express');
let router = express.Router();
const guildsdb = require('../../models/guilds');

/* GET home page. */
router.get('/', function(req, res, next) {
	guildsdb.find({guildID: '266859494833651712'}, {}, {lean: true}).then( (doc) => {
		res.render('index', {title: 'Form Validation', doc: doc, success: req.session.success, errors: req.session.errors});
		req.session.errors = null;
		req.session.errors = null;
	});
	
});

router.post('/submit', (req, res, next) => {
	req.check('email', 'Invalid email address.').isEmail();
	req.check('password', 'Password is invalid').isLength({min: 6, max: 32}).equals(req.body.cpassword);
	
	let errors = req.validationErrors();

	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
	} else req.session.success = true;
	res.redirect('/');
});

module.exports = router;
