const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const envType = {'development':'dev', 'production':'prod'};
const distFolder = './dist';

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
        outFile: envMode + '.OutSystemsUI.js',
    });

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
            .pipe(tsProject()).js
            .pipe(gulp.dest(distFolder));
    }

    return tsResult
}

// TypeScript Transpile Task
exports.transpileDev = tsTranspileDev;
exports.transpileProd = tsTranspileProd;