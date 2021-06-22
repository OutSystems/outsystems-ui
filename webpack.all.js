const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
	entry: {
		'outsystems-ui': './src/scss/os-ui.js',
	},
});
