let express = require('express');
let router = express.Router();
const guildsdb = require('../../models/guilds');
let request = require('request');
let Client = require('node-rest-client').Client;
let client = new Client();
let fs = require('fs');

let oauth2 = require('simple-oauth2').create({
	client: {
		id: '266858238379556885',
		secret: 'iAe8DL16scI_HsvK2LgBimnHhNjkPGXf'
	},
	auth: {
		tokenHost: 'https://discordapp.com',
		authorizePath: '/api/oauth2/authorize',
		tokenPath: '/api/oauth2/token',
		revokePath: '/api/oauth2/revoke'
	}
});

const authorizationUri = oauth2.authorizationCode.authorizeURL({
	redirect_uri: 'http://localhost:3000/callback',
	scope: 'identify guilds'
	//state: '<state>'
});

function refreshToken(tokenObject, req) {
	let token = oauth2.accessToken.create(tokenObject);
	
	if (token.expired()) {
		token.refresh((error, result) => {
			req.session.token = result;
			console.log(result);
		});
	} else console.log("Token not expired.")
	
}

/* GET home page. */
router.get('/', function(req, res, next) {
	let options = {
		title: 'Hydrabot'
	};
	if (req.session.token) {
		let args = {
			headers: {Authorization: 'Bearer ' + req.session.token.token.access_token}
		};
		client.get('https://discordapp.com/api/users/@me', args, (userData) => {
			client.get('https://discordapp.com/api/users/@me/guilds', args, (guildsData) => {
				
				let guilds = guildsData.filter((el) => {
					return el.owner;
				});
				req.session.guilds = options.guilds = guilds;
				req.session.userData = options.user = userData;
				options.token = req.session.token.token;
				res.render('index', options);
			});
		});
	} else {
		res.render('index', options);
	}
	
});

router.get('/guild/:id', (req, res, next) => {
	if (req.session.token) {
		refreshToken(req.session.token, req);
		let guild = req.session.guilds.filter((el) => { return el.id == req.params.id});
		if (guild.length > 0) {
			res.render('guild', {title: 'Hydrabot', guild: req.params.id, user: req.session.userData});
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

router.get('/guild/:id/:page', (req, res, next) => {
	let pages = {
		music: ['play', 'skip', 'stop', 'queue'],
		other: ['help', 'ping', 'stats']
	};
	
	if (req.session.token) {
		refreshToken(req.session.token, req);
		let guild = req.session.guilds.filter((el) => { return el.id == req.params.id});
		if (guild.length > 0) {
			
			let page = false;
			for (let key in pages) {
				if (pages[key].includes(req.params.page)) {
					fs.readFile(`./views/commands/${req.params.page}.hbs`, (err, data) => {
						if (err) throw err;
						res.render('guild', {title: 'Hydrabot', guild: req.params.id, user: req.session.userData, command: data, active: req.params.page});
					});
					break;
				}
			}
			
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

router.get('/command/', (req, res, next) => {
	res.redirect('/');
});

router.get('/auth', (req, res, next) => {
	res.redirect(authorizationUri);
});

router.get('/callback', (req, res, next) => {
	const tokenConfig = {
		code: req.query.code,
		redirect_uri: 'http://localhost:3000/callback'
	};
	oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
		if (error) {
			console.log('Access Token Error', error.message);
			res.send(error);
			return;
		}
		
		const token = oauth2.accessToken.create(result);
		req.session.token = token;
		console.dir(token);
		res.redirect('/');
	});
});

router.get('/logout', (req, res, next) => {
	if (req.session.token) {
		let accessToken = oauth2.accessToken.create(req.session.token.token);
		accessToken.revoke('access_token', (error) => {
			// Session ended. But the refresh_token is still valid.
			
			// Revoke the refresh_token
			accessToken.revoke('refresh_token', (error) => {
				console.log('token revoked.');
			});
		});
		req.session.token = null;
	}
	res.redirect('/');
});

module.exports = router;
