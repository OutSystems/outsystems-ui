const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const outputPath = path.join(__dirname, 'dist');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const package = require('./package.json');

module.exports = (env) => {
	return {
		entry: {
			'outsystems-ui': './src/scss/os-ui.js',
		},
		mode: 'development',
		output: {
			path: outputPath,
			filename: `${env.prefix}.[name].js`,
			clean: true,
		},
		stats: {
			colors: true,
			children: true,
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
				},
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
			new CopyPlugin({
				patterns: [{ from: 'src/static', to: 'static' }],
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
		devtool: false,
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			port: 3000,
			writeToDisk: true,
		},
	};
};
