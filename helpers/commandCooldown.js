module.exports = exports = (user) =>{
	let cooldown = 1500;
	let diff = Date.now() - user;

	if (diff < cooldown) {
		return true;
	} else if (diff >= cooldown) {
		return false;
	}

};
