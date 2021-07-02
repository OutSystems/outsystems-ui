var sassdoc = require('sassdoc');

sassdoc('./src', {
	theme: 'herman',
	verbose: true,
	dest: './sassdocs',
}).then(
	function () {
		console.log('Your documentation has been generated!');
	},
	function (err) {
		console.error(err);
	}
);
