const gulp = require('gulp');

// gulp-autoprefixer 9+ is ESM-only, so require() hands back the module namespace and the callable sits on
// `.default`. Reading it with a fallback keeps this working on the CommonJS majors (8 and below) too.
// The other ESM plugins below (postcss-discard-comments/-duplicates 9+) already unwrap to a function.
const autoprefixerModule = require('gulp-autoprefixer');
const autoprefixer = autoprefixerModule.default ?? autoprefixerModule;
const postcss = require('gulp-postcss');
const postcssdc = require('postcss-discard-comments');
const postcssdd = require('postcss-discard-duplicates');
const removeEmptyLines = require('gulp-remove-empty-lines');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const project = require('../ProjectSpecs/DefaultSpecs');
const distFolder = './dist';
let watchScssThemes = 'src/scss/*.scss';

// Check if a platformType has been defined through npm script, if so, compile it's own SCSS theme only, otherwise it will compile all.
function checkForScssThemeToBeCompiled() {
    const result = {
        hasError: false,
        errorMessage: ''
    }

    if(process.env.npm_config_target !== undefined) {
        if(project.globalConsts.scssPlatformTarget[process.env.npm_config_target] === undefined) {
            result.hasError = true;
            result.errorMessage = `Given platform '${process.env.npm_config_target}' does not have an SCSS bundle. Platforms available for SCSS:\n • ${Object.keys(project.globalConsts.scssPlatformTarget).join("\n • ")}`
            console.log(`\n⛔️ ERROR: ${result.errorMessage}\n`);
        } else {
            watchScssThemes = `src/scss/${project.globalConsts.scssPlatformTarget[process.env.npm_config_target]}.OutSystemsUI.scss`;
        }
    }

    return result;
}

// Compile SCSS
function scssTranspile(cb, envMode) {
    if(envMode === project.globalConsts.envType.development) {
        gulp.src(watchScssThemes)
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
        gulp.src(watchScssThemes)
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([postcssdc, postcssdd]))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 versions']
            }))
            .pipe(removeEmptyLines())
            .pipe(gulp.dest(distFolder));    
    }

    cb();
}

// Set as Development Mode
function scssTranspileDev(cb) {
    if(checkForScssThemeToBeCompiled().hasError === false) {
        scssTranspile(cb, project.globalConsts.envType.development);
    }
}

// Set as Production Mode
function scssTranspileProd(cb) {
    if(checkForScssThemeToBeCompiled().hasError === false) {
        scssTranspile(cb, project.globalConsts.envType.production);
    }
}

// SCSS Transpile Tasks
exports.transpileDev = scssTranspileDev;
exports.transpileProd = scssTranspileProd;