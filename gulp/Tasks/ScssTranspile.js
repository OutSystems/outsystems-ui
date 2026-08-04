const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const postcssdc = require('postcss-discard-comments');
const postcssdd = require('postcss-discard-duplicates');
const removeEmptyLines = require('gulp-remove-empty-lines');
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

// Silence known, pre-existing Dart Sass deprecation warnings so the build output
// stays clean and real errors stand out. 'import' was dropped once ROU-12911 migrated
// all first-party SCSS to @use/@forward - keep it out so a regression isn't masked.
// The rest are unrelated: legacy-js-api is gulp-sass's renderSync notice; global-builtin
// and if-function are pre-existing, unrelated Sass API deprecations. Requires Dart Sass >= 1.80.
const sassOptions = {
	silenceDeprecations: ['global-builtin', 'if-function', 'legacy-js-api'],
	quietDeps: true,
};

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
			.pipe(sass(sassOptions).on('error', sass.logError))
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
            .pipe(sass(sassOptions).on('error', sass.logError))
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