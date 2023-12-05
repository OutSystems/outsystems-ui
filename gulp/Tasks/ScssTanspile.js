const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const postcssdc = require('postcss-discard-comments');
const postcssdd = require('postcss-discard-duplicates');
const removeEmptyLines = require('gulp-remove-empty-lines');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const project = require('../ProjectSpecs/DefaultSpecs');
const distFolder = './dist';
const watchScssThemes = 'src/scss/*.scss';

// Set as Development Mode
function scssTranspileDev() {
    return scssTranspile(project.globalConsts.envType.development);
}

// Set as Production Mode
function scssTranspileProd() {
    return scssTranspile(project.globalConsts.envType.production);
}

// Compile SCSS
function scssTranspile(envMode) {
    let cssResult;

    if(envMode === project.globalConsts.envType.development) {
        cssResult = gulp
			.src(watchScssThemes)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(postcss([postcssdc, postcssdd]))
			.pipe(
				autoprefixer({
					overrideBrowserslist: ['last 10 versions'],
				})
			)
			.pipe(
				rename({
					prefix: `${project.globalConsts.envType.development}.`,
				})
			)
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(distFolder));
    } else {
        cssResult = gulp.src(watchScssThemes)
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([postcssdc, postcssdd]))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 versions']
            }))
            .pipe(removeEmptyLines())
            .pipe(gulp.dest(distFolder));    
    }

    return cssResult;
}

// SCSS Transpile Tasks
exports.transpileDev = scssTranspileDev;
exports.transpileProd = scssTranspileProd;