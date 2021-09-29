const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const outputPath = path.join(__dirname, 'dist');
const webpack = require('webpack');
const package = require('./package.json');

module.exports = (env) => {
	return {
		entry: {
			'outsystems-ui-current': './src/scss/os-ui-current.scss',
			'outsystems-ui-new': './src/scss/os-ui-new.scss',
		},
		mode: env.prefix === 'dev' ? 'development' : 'production',
		stats: {
			colors: true,
			children: true,
		},
		module: {
			rules: [
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader',
						},
						{
							loader: 'sass-loader',
						},
					],
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin({}),
			new MiniCssExtractPlugin({
				filename: `${env.prefix}.[name].css`,
			}),
			new HtmlWebpackPlugin({
				template: 'index.html',
				prefix: env.prefix,
			}),
			new webpack.BannerPlugin({
				banner: `[filebase] || Version: ${package.version} || Generated: ${new Date()
					.toISOString()
					.slice(0, 19)
					.replace('T', ' ')}`,
			}),
		],
		devServer: {
			contentBase: outputPath,
			port: 3000,
			writeToDisk: true,
		},
		devtool: env.prefix === 'dev' ? 'source-map' : false,
	};
};
