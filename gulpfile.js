const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');

const browser = require('browser-sync');
const clean = require('gulp-clean');
const template = require('gulp-template');

// Get dependencies tasks
const cssTranspile = require('./gulp/tasks/ScssTanspile');
const createScssFile = require('./gulp/tasks/CreateScssFile');
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

// Starts a Browser instance
function initServer() {
    // Create index.html
    gulp.src("./gulp/templates/index.html")
        .pipe(template({}))
        .pipe(gulp.dest(distFolder));

    browser.init({server: distFolder, port: serverPort, cors: true});
}

// Watch files changed
function watchFiles() {
    watch(watchScssFiles, series(cssTranspile.transpileDev));
    watch(watchTsFiles, series(tsTranspile.transpileDev));
};


// Gulp tasks
exports.startDevelopment = series(
    cleanOldFiles,
    parallel(cssTranspile.transpileDev, tsTranspile.transpileDev),
    parallel(watchFiles, initServer)
);

exports.createProduction = series(
    cleanOldFiles,
    cssTranspile.transpileProd,
    tsTranspile.transpileProd
);

exports.updateScssFile = createScssFile.create_osui_scss_file;
