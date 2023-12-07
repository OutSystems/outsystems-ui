const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');
const fs = require('fs');

const browser = require('browser-sync');
const clean = require('gulp-clean');

// Get dependencies tasks
const project = require('./gulp/ProjectSpecs/DefaultSpecs');
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

// Method to update development template code
function updateIndexTemplateFile() {
    // Get the index.html base file
    let code = fs.readFileSync('./gulp/Template/index.html', 'utf8');

    let jsLinks = '';
    let scssLinks = '';
    if(process.env.npm_config_platform !== undefined && project.globalConsts.platforms[process.env.npm_config_platform] !== undefined) {
        code = code.replace(" • --platform--", " • " + project.globalConsts.platforms[process.env.npm_config_platform]);
        jsLinks = `<li><p><a target="blank" href="./dev.${project.globalConsts.platforms[process.env.npm_config_platform]}.OutSystemsUI.js">${project.globalConsts.platforms[process.env.npm_config_platform]}.OutSystemsUI.js</a></p></li>`;
        scssLinks = `<li><p><a target="blank" href="./dev.${project.globalConsts.platforms[process.env.npm_config_platform]}.OutSystemsUI.css">${project.globalConsts.platforms[process.env.npm_config_platform]}.OutSystemsUI.css</a></p></li>`;
    } else {
        code = code.replace(" • --platform--", "");
        const pts = project.globalConsts.platforms;
        for(const pt in pts) {
            jsLinks += `<li><p><a target="blank" href="./dev.${pts[pt]}.OutSystemsUI.js">${pts[pt]}.OutSystemsUI.js</a></p></li>\n`;
            scssLinks += `<li><p><a target="blank" href="./dev.${pts[pt]}.OutSystemsUI.css">${pts[pt]}.OutSystemsUI.css</a></p></li>\n`;
        }
    }

    code = code.replace("<li>jsListItemToBeReplaced</li>", jsLinks);
    code = code.replace("<li>scssListItemToBeReplaced</li>", scssLinks);

    // Create the new index.html at the dist folder!
    fs.writeFileSync(`${distFolder}/index.html`, code, 'utf8');
}

// Starts a Browser instance
function initServer() {
    updateIndexTemplateFile();
    setTimeout(() => {
        browser.init({server: distFolder, port: serverPort, cors: true});
    }, 0);
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