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
const fs = require('node:fs');
const path = require('node:path');
const { Transform } = require('node:stream');

const project = require('../ProjectSpecs/DefaultSpecs');
const distFolder = './dist';
let watchScssThemes = 'src/scss/*.scss';

// Build provenance line written under the main banner of the production CSS:
//   /*! Tokens 2.6.0 • Commit fe093aecc • Built 2026-11-05 14:08 UTC */
// The compiled CSS is pasted into the O11 / ODC modules, so it has to say which tokens release and which commit
// it was built from (ROU-13182). It is added here, not in the generated SCSS entry files, because those are
// committed and a SHA or a date there would dirty them on every build. Production only: in development it would
// shift every sourcemap line by one, and the dev bundle never reaches a module.
// The commit HEAD points at, read from the .git directory rather than by spawning `git`, so the build does not
// run whatever `git` the PATH resolves to. Handles a detached HEAD, a branch ref (loose or packed) and a
// worktree / submodule checkout, where `.git` is a file pointing at the real git directory. Returns '' when it
// cannot tell; CI passes GITHUB_SHA instead.
function readHeadCommit() {
	try {
		let gitDir = path.join(process.cwd(), '.git');
		if (fs.statSync(gitDir).isFile()) {
			const pointer = fs.readFileSync(gitDir, 'utf8').match(/^gitdir: (.+)$/m);
			if (pointer === null) return '';
			gitDir = path.resolve(process.cwd(), pointer[1].trim());
		}
		// A linked worktree keeps HEAD in its own directory and refs in the common one.
		const commonDirFile = path.join(gitDir, 'commondir');
		const commonDir = fs.existsSync(commonDirFile)
			? path.resolve(gitDir, fs.readFileSync(commonDirFile, 'utf8').trim())
			: gitDir;

		const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
		if (head.startsWith('ref: ') === false) return head;

		const ref = head.slice('ref: '.length);
		const looseRef = path.join(commonDir, ref);
		if (fs.existsSync(looseRef)) return fs.readFileSync(looseRef, 'utf8').trim();

		const packedRefs = path.join(commonDir, 'packed-refs');
		if (fs.existsSync(packedRefs) === false) return '';
		const packed = fs
			.readFileSync(packedRefs, 'utf8')
			.split('\n')
			.find((line) => line.endsWith(` ${ref}`));
		return packed === undefined ? '' : packed.split(' ')[0];
	} catch (e) {
		// Unreadable or unexpected git layout: the line is provenance only, so it says 'unknown' rather than
		// failing the build.
		return '';
	}
}

function getBuildInfoLine() {
	let tokensVersion = 'unknown';
	try {
		// Read from disk: a package `exports` map can refuse `require('<pkg>/package.json')`.
		const manifest = path.join(process.cwd(), 'node_modules', 'outsystems-design-tokens', 'package.json');
		tokensVersion = JSON.parse(fs.readFileSync(manifest, 'utf8')).version;
	} catch (e) {
		// Not installed: build:tokens has already failed with a clearer message.
	}

	const commit = (readHeadCommit() || process.env.GITHUB_SHA || 'unknown').slice(0, 9);

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