const gulp = require('gulp');
const { watch, series, parallel } = require('gulp');
const browser = require('browser-sync');
const clean = require('gulp-clean');
const fs = require('fs');

// Get dependencies tasks
const createScssFile = require('./gulp/Tasks/CreateScssFile');
const cssTranspile = require('./gulp/Tasks/ScssTanspile');
const project = require('./gulp/ProjectSpecs/DefaultSpecs');
const tsTranspile = require('./gulp/Tasks/TsTanspile');
const updatetVersion = require('./gulp/Tasks/UpdateVersion');
const ptdNpm = require('./gulp/Tasks/PrepareToDeployNpm');
const gitIgnoreUpdate = require('./gulp/Tasks/GitIgnoreUpdate');

// Local configs
const distFolder = './dist';
const serverPort = 3000;
const watchScssFiles = 'src/**/*.scss';
const watchTsFiles = 'src/**/*.ts';

// Clean Dist Folder
function cleanOldFiles() {
    return gulp.src(distFolder + "/*", {read: false}).pipe(clean());
}

// Starts a Browser instance
function initServer() {
    updateIndexTemplateFile();
    setTimeout(() => {
        browser.init({server: distFolder, port: serverPort, cors: true});
    }, 0);
}

// Method to update development template code
function updateIndexTemplateFile() {
    // Get the index.html base file
    let code = fs.readFileSync('./gulp/Template/index.html', 'utf8');

    let jsLinks = '';
    let scssLinks = '';
    if(process.env.npm_config_target !== undefined && project.globalConsts.targetPlatform[process.env.npm_config_target] !== undefined) {
        code = code.replace(" • --platform--", " • " + project.globalConsts.targetPlatform[process.env.npm_config_target]);
        jsLinks = `<li><p><a target="blank" href="./dev.${project.globalConsts.targetPlatform[process.env.npm_config_target]}.OutSystemsUI.js">${project.globalConsts.targetPlatform[process.env.npm_config_target]}.OutSystemsUI.js</a></p></li>`;
        scssLinks = `<li><p><a target="blank" href="./dev.${project.globalConsts.targetPlatform[process.env.npm_config_target]}.OutSystemsUI.css">${project.globalConsts.targetPlatform[process.env.npm_config_target]}.OutSystemsUI.css</a></p></li>`;
    } else {
        code = code.replace(" • --platform--", "");
        const pts = project.globalConsts.targetPlatform;
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
    parallel(cssTranspile.transpileProd, tsTranspile.transpileProd),
);

exports.updateScssFile = createScssFile.update_osui_scss_file_dev;
exports.updateVersion = updatetVersion.setVersion;
exports.gtaSetVersion = updatetVersion.gtaSetVersion;
exports.prepareToDeploy = ptdNpm.prepareToDeployNpm;
exports.removeDistFromGitIgnore = gitIgnoreUpdate.removeDist;