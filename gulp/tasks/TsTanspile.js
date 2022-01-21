const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const envType = {'development':'dev', 'production':'prod'};
const distFolder = './dist';

const tsProject = ts.createProject('tsconfig.json', {
                        outDir: distFolder,
                        outFile: process.env.NODE_ENV + '-outsystems-ui.js',
                    });

// Compile TypeScript
function tsTranspile() {
    let tsResult;

    if(process.env.NODE_ENV === envType.development) {
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
exports.transpile = tsTranspile;