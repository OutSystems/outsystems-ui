const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');

const browser = require('browser-sync');
const clean = require('gulp-clean');
const template = require('gulp-template');

// Get dependencies tasks
const cssTranspile = require('./gulp/tasks/ScssTanspile');
const pattern = require('./gulp/tasks/NewPattern');
const tsTranspile = require('./gulp/tasks/TsTanspile');

// Local configs
const serverPort = 3000;
const distFolder = './dist';
const watchScssFiles = 'src/**/*.scss';
const watchTsFiles = 'src/**/*.ts';

// Clean Dist Folder
function cleanOldFiles() {
    return gulp.src(distFolder + "/*", {read: false}).pipe(clean());
}

// Starts a Brower instance
function initServer() {
    // Create index.html
    gulp.src("./gulp/templates/index.html")
        .pipe(template({}))
        .pipe(gulp.dest(distFolder));

    browser.init({server: distFolder, port: serverPort});
}

// Watch files changed
function watchFiles() {
    watch(watchScssFiles, series(cssTranspile.transpile));
    watch(watchTsFiles, series(tsTranspile.transpile));
};


// Gulp tasks
exports.startDevelopment = series(
    cleanOldFiles,
    parallel(cssTranspile.transpile, tsTranspile.transpile),
    parallel(watchFiles, initServer)
);

exports.createProduction = series(
    cleanOldFiles,
    parallel(cssTranspile.transpile, tsTranspile.transpile)
);

exports.newPattern = pattern.create;