const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const postcssdc = require('postcss-discard-comments');
const removeEmptyLines = require('gulp-remove-empty-lines');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const envType = {'development':'dev', 'production':'prod'}
const distFolder = './dist';
const watchScssThemes = 'src/scss/*.scss';

// Compile SCSS
function scssTranspile() {
    let cssResult;

    if(process.env.NODE_ENV === envType.development) {
        cssResult = gulp.src(watchScssThemes)
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([postcssdc]))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 versions']
            }))
            .pipe(removeEmptyLines())
            .pipe(rename({
                prefix: process.env.NODE_ENV + "-",
            }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(distFolder));
    } else {
        cssResult = gulp.src(watchScssThemes)
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([postcssdc]))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 versions']
            }))
            .pipe(removeEmptyLines())
            .pipe(rename({
                prefix: process.env.NODE_ENV + "-",
            }))
            .pipe(gulp.dest(distFolder));    
    }

    return cssResult;
}

// SCSS Transpile Task
exports.transpile = scssTranspile;