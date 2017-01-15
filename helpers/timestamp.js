module.exports = exports = (time) => {
	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;
	function str_pad_left(string,pad,length) {
		return (new Array(length+1).join(pad)+string).slice(-length);
	}
	return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
};
