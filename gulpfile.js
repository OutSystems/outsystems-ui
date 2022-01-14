const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const browser = require('browser-sync');
const clean = require('gulp-clean');
const postcss = require('gulp-postcss');
const postcssdc = require('postcss-discard-comments');
const removeEmptyLines = require('gulp-remove-empty-lines');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const port = 3000;
const envType = { development: 'dev', production: 'prod' };
const distFolder = './dist';
const watchScssFiles = 'src/**/*.scss';
const watchScssThemes = 'src/scss/*.scss';
const watchTsFiles = 'src/**/*.ts';

const tsProject = ts.createProject('tsconfig.json', {
	outDir: distFolder,
	rootDir: './src/scripts',
	outFile: process.env.NODE_ENV + '-outsystems-ui.js',
});

// Clean Dist Folder
function cleanOldFiles() {
	return gulp.src(distFolder + '/*', { read: false }).pipe(clean());
}

// Compile SCSS
function cssTranspile() {
	let cssResult;

	if (process.env.NODE_ENV === envType.development) {
		cssResult = gulp
			.src(watchScssThemes)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(postcss([postcssdc]))
			.pipe(
				autoprefixer({
					overrideBrowserslist: ['last 10 versions'],
				})
			)
			.pipe(removeEmptyLines())
			.pipe(
				rename({
					prefix: process.env.NODE_ENV + '-',
				})
			)
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(distFolder));
	} else {
		cssResult = gulp
			.src(watchScssThemes)
			.pipe(sass().on('error', sass.logError))
			.pipe(postcss([postcssdc]))
			.pipe(
				autoprefixer({
					overrideBrowserslist: ['last 10 versions'],
				})
			)
			.pipe(removeEmptyLines())
			.pipe(
				rename({
					prefix: process.env.NODE_ENV + '-',
				})
			)
			.pipe(gulp.dest(distFolder));
	}

	return cssResult;
}

// Compile TypeScript
function jsTranspile() {
	let tsResult;

	if (process.env.NODE_ENV === envType.development) {
		tsResult = tsProject
			.src()
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.js.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(distFolder));
	} else {
		tsResult = tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(distFolder));
	}

	return tsResult;
}

// Starts a Brower instance
function initServer() {
	browser.init({ server: distFolder, port: port });
}

// Watch files changed
function watchFiles() {
	watch(watchScssFiles, series(cssTranspile));
	watch(watchTsFiles, series(jsTranspile));
}

// Gulp tasks
exports.startDevelopment = series(cleanOldFiles, parallel(cssTranspile, jsTranspile), parallel(watchFiles, initServer));
exports.createProduction = series(cleanOldFiles, parallel(cssTranspile, jsTranspile));
