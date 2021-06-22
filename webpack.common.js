const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const outputPath = path.join(__dirname, 'dist');
const webpack = require('webpack');
const package = require('./package.json');

let prefix = process.env.PREFIX === 'prod ' ? 'prod' : 'dev';

module.exports = {
	mode: 'development',
	output: {
		path: outputPath,
		filename: `${prefix}.[name].js`,
	},
	stats: {
		colors: true,
		children: false,
	},
	watch: false,
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
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
						options: {
							implementation: require('sass'),
							sassOptions: {},
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${prefix}.[name].css`,
		}),
		new HtmlWebpackPlugin({
			template: 'index.html',
			prefix: prefix,
		}),
		new webpack.BannerPlugin({
			banner: `[filebase] || Version: ${package.version} || Generated: ${new Date()
				.toISOString()
				.slice(0, 19)
				.replace('T', ' ')}`,
		}),
	],
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		disableHostCheck: true,
		hot: false,
		https: false,
		inline: false,
		liveReload: false,
		port: 3000,
		watchContentBase: true,
		writeToDisk: true,
	},
};
