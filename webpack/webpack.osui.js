const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('../webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = (env) => {
	let prefix = env.mode === 'production' ? 'prod' : 'dev';
	return merge(common, {
		mode: env.mode || 'development',
		output: {
			filename: `${prefix}.[name].js`,
		},
		entry: {
			'outsystems-ui': './src/scss/os-ui.js',
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: `${prefix}.[name].css`,
			}),
		],
	});
};
