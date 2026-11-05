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
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const project = require('../ProjectSpecs/DefaultSpecs');
const distFolder = './dist';
let watchScssThemes = 'src/scss/*.scss';

// Build provenance line written under the main banner of the production CSS:
//   /*! Tokens 2.6.0 • Commit fe093aecc • Built 2026-11-05 14:08 UTC */
// The compiled CSS is pasted into the O11 / ODC modules, so it has to say which tokens release and which commit
// it was built from (ROU-13182). It is added here, not in the generated SCSS entry files, because those are
// committed and a SHA or a date there would dirty them on every build. Production only: in development it would
// shift every sourcemap line by one, and the dev bundle never reaches a module.
function getBuildInfoLine() {
	let tokensVersion = 'unknown';
	try {
		// Read from disk: a package `exports` map can refuse `require('<pkg>/package.json')`.
		const manifest = path.join(process.cwd(), 'node_modules', 'outsystems-design-tokens', 'package.json');
		tokensVersion = JSON.parse(fs.readFileSync(manifest, 'utf8')).version;
	} catch (e) {
		// Not installed: build:tokens has already failed with a clearer message.
	}

	let commit = (process.env.GITHUB_SHA || '').slice(0, 9);
	if (commit === '') {
		try {
			commit = execSync('git rev-parse --short=9 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
				.toString()
				.trim();
		} catch (e) {
			commit = 'unknown';
		}
	}

	const built = new Date().toISOString().slice(0, 16).replace('T', ' ');

	return `/*! Tokens ${tokensVersion} • Commit ${commit} • Built ${built} UTC */\n`;
}

// Inserts the build provenance line right after the first `/*! … */` banner of each compiled file.
function addBuildInfo() {
	const line = getBuildInfoLine();

	return new Transform({
		objectMode: true,
		transform(file, _encoding, callback) {
			if (file.isBuffer()) {
				const css = file.contents.toString();
				const bannerEnd = css.indexOf('*/');
				if (bannerEnd !== -1) {
					const insertAt = css.indexOf('\n', bannerEnd) + 1 || css.length;
					file.contents = Buffer.from(css.slice(0, insertAt) + line + css.slice(insertAt));
				}
			}
			callback(null, file);
		},
	});
}

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
            .pipe(addBuildInfo())
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