const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');
const fs = require('fs');

const browser = require('browser-sync');
const clean = require('gulp-clean');

// Get dependencies tasks
const createScssFile = require('./gulp/Tasks/CreateScssFile');
const cssTranspile = require('./gulp/Tasks/ScssTanspile');
const tsTranspile = require('./gulp/Tasks/TsTanspile');
const updatetVersion = require('./gulp/Tasks/UpdateVersion');

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
    // Get the index.html base file
    let code = fs.readFileSync('./gulp/Template/index.html', 'utf8');
    // Create the new index.html at the dist folder!
    fs.writeFileSync(`${distFolder}/index.html`, code, 'utf8');

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
    createScssFile.update_osui_scss_file_dev,
    parallel(cssTranspile.transpileDev, tsTranspile.transpileDev),
    parallel(watchFiles, initServer)
);

exports.createProduction = series(
    cleanOldFiles,
    createScssFile.update_osui_scss_file_prod,
    cssTranspile.transpileProd,
    tsTranspile.transpileProd
);

exports.updateScssFile = createScssFile.update_osui_scss_file_dev;
exports.updateVersion = updatetVersion.setVersion;
exports.gtaSetVersion = updatetVersion.gtaSetVersion;