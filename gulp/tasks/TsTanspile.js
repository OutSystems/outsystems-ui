const gulp = require('gulp');
const {series} = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
const ts = require('gulp-typescript');

const project = require('../ProjectSpecs/DefaultSpecs');

const envType = {'development':'dev.', 'production':''};
const distFolder = './dist';

let filePath = '';

// Set as Development Mode
function tsTranspileDev() {
    return tsTranspile(envType.development);
}

// Set as Production Mode
function tsTranspileProd() {
    return tsTranspile(envType.production);
}

// Compile TypeScript
function tsTranspile(envMode) {
    let tsResult;
    let tsProject = ts.createProject('tsconfig.json', {
        outDir: distFolder,
        declaration: envMode === envType.production ? true : false,
        outFile: envMode + 'OutSystemsUI.js',
    });

    filePath = distFolder + "/" + envMode + 'OutSystemsUI.js';

    if(envMode === envType.development) {
        tsResult = tsProject
            .src()
            .pipe(sourcemaps.init())
            .pipe(tsProject()).js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(distFolder));
    } else {
        tsResult = tsProject
            .src()
            .pipe(tsProject())
            .pipe(gulp.dest(distFolder));
    }

    return tsResult
}

// 
function updateFwkInfo(cb) {    
    // Set the Specifications text info
    let specsInfo = '';

    specsInfo += `/*!\n`;
    specsInfo += `${project.info.name} ${project.info.version}\n`;
    if (project.info.description !== '') {
        specsInfo += `${project.info.description}\n`;
    }
    specsInfo += `${project.info.url}\n`;
    specsInfo += `${project.info.gitHub}\n`;
    specsInfo += `*/ \n`;

    // Read file code
    let code = fs.readFileSync(filePath, 'utf8');
    // Update code
    let updatedCode = specsInfo + code;
    // Update the existing file info with the new one!
    fs.writeFileSync(filePath, updatedCode, 'utf8');

    cb();
}

// TypeScript Transpile Task
exports.transpileDev = series(tsTranspileDev, updateFwkInfo);
exports.transpileProd = series(tsTranspileProd, updateFwkInfo);