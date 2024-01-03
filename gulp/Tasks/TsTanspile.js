const gulp = require('gulp');
const {series} = require('gulp');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const distFolder = './dist';
const project = require('../ProjectSpecs/DefaultSpecs');

let defaultTsConfigText = '';
let filesPath = {};

// Method that will check if platformType has been defined through npm inline variable. If yes, that's the one to be tackled
function getDefaultPlatformType(platformType) {
    const pt = {
        error: false,
        shouldCreateAll: true,
        type: '',
    }

    // Check if a platformType has been passed as an npm inline script value
    if(process.env.npm_config_target !== undefined) {
        if(project.globalConsts.targetPlatform[process.env.npm_config_target] === undefined) {
            pt.error = true;
            pt.errorMessage = `Given platform '${process.env.npm_config_target}' does not exist. Plaforms availabe:\n • ${Object.keys(project.globalConsts.targetPlatform).join("\n • ")}`
        } else {
            pt.type = process.env.npm_config_target;
            pt.shouldCreateAll = false;
        }
    } else {
        pt.type = platformType !== undefined ? platformType : Object.keys(project.globalConsts.targetPlatform)[0];
    }

    return pt;
}

// Method that will handle the end of tsCompilation
function onTsCompileFinish(platformType, cb, shouldCreateAll) {
    const pts = project.globalConsts.targetPlatform;
    if(shouldCreateAll === false || platformType === pts[Object.keys(pts)[Object.keys(pts).length-1]]) {
        cb();
    }
}

// Update tsConfig after the compilation in order to ensure it will not be changed dynamically
function rollBackTsConfigFile() {
	// Update file with the default text!
	fs.writeFileSync('tsconfig.json', defaultTsConfigText, 'utf8');
    defaultTsConfigText = '';
}

// Compile TypeScript
function tsTranspile(cb, envMode, platformType) {
    // Store the default platformType
    const pt = getDefaultPlatformType(platformType);
    // Check if platformTye exist and it's valid
    if(pt.error) {
        console.log(`\n⛔️ ERROR: ${pt.errorMessage}\n`);
        return;
    }
    // Set filesPath accordingly as well
    filesPath[pt.type] = `${distFolder}/${envMode === project.globalConsts.envType.production ? '' : envMode + "."}${project.globalConsts.targetPlatform[pt.type]}.OutSystemsUI.js`;
    // Update tsConfig file and do the Ts compilation accordingly
    updateTsConfigFile(cb, envMode, project.globalConsts.targetPlatform[pt.type], pt.shouldCreateAll);
    // Check if there is still any pending platform to tackle
    if(pt.shouldCreateAll && pt.type !== Object.keys(project.globalConsts.targetPlatform)[Object.keys(project.globalConsts.targetPlatform).length-1]) {
        tsTranspile(cb, envMode, Object.keys(project.globalConsts.targetPlatform)[(Object.keys(project.globalConsts.targetPlatform).indexOf(pt.type)+1)]);
    }
}

// Method that will trigger the transpile of Ts according if it's development or production mode and platform type (O11 or ODC)
async function tsTranspileBasedOnPlatform(cb, envMode, platformType, shouldCreateAll) {
    let tsProject = ts.createProject('tsconfig.json', {
        outDir: distFolder,
        declaration: envMode === project.globalConsts.envType.production ? true : false,
        outFile: `${envMode === project.globalConsts.envType.production ? '' : envMode + "."}${platformType}.OutSystemsUI.js`,
    }); 

    if(envMode === project.globalConsts.envType.development) {
        tsProject
            .src()
            .pipe(sourcemaps.init())
            .pipe(tsProject()).js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(distFolder))
            .on('finish', () => {
				onTsCompileFinish(platformType, cb, shouldCreateAll);
			});
    } else {
        tsProject
            .src()
            .pipe(tsProject())
            .pipe(gulp.dest(distFolder))
            .on('finish', () => {
                onTsCompileFinish(platformType, cb, shouldCreateAll);
			});
    }

    // Rollback tsconfig file to the default state
    if(defaultTsConfigText !== '') {
        rollBackTsConfigFile();
    }
}

// Set as Development Mode
function tsTranspileDev(cb) {
    tsTranspile(cb, project.globalConsts.envType.development);
}

// Set as Production Mode
function tsTranspileProd(cb) {
    tsTranspile(cb, project.globalConsts.envType.production);
}

// Add section info to the compiled files.
function updateFwkAndPlatformInfo(cb) {    
    for(const pt in filesPath) {
        // Set the Specifications text info
        let specsInfo = '';

        specsInfo += `/*!\n`;
        specsInfo += `${project.info.name} ${project.info.version} • ${project.globalConsts.targetPlatform[pt]} Platform\n`;
        if (project.info.description !== '') {
            specsInfo += `${project.info.description}\n`;
        }
        specsInfo += `${project.info.url}\n`;
        specsInfo += `${project.info.gitHub}\n`;
        specsInfo += `*/ \n`;

        // Read file code
        let jsCode = fs.readFileSync(filesPath[pt], 'utf8');
        // Set *.d.ts file path
        const dtsFilePath = filesPath[pt].replace(".js", ".d.ts");
        // Check if the *.d.ts file exist
        let dtsCode = fs.existsSync(dtsFilePath) ? fs.readFileSync(dtsFilePath, 'utf8') : null;
        
        // Set platformType to the OSFramework.OSUI.Constants
        jsCode = jsCode.replace("<->platformType<->", project.globalConsts.targetPlatform[pt]);
        dtsCode = dtsCode !== null ? dtsCode.replace("<->platformType<->", project.globalConsts.targetPlatform[pt]) : null;

        // Update code
        let updatedCode = specsInfo + jsCode;
        let updatedDtsCode = dtsCode !== null ? specsInfo + dtsCode : null;

        // Ensure code will be set properly before set the update.
        setTimeout(() => {
            // Update the existing file info with the new one!
            fs.writeFileSync(filesPath[pt], updatedCode, 'utf8');
            if(updatedDtsCode !== null){
                fs.writeFileSync(dtsFilePath, updatedDtsCode, 'utf8');
            }
        }, 0);
    }

    cb();
}

// Method that will update the tsConfig file in order to set the exclude files under given platformType
function updateTsConfigFile(cb, envMode, platformType, shouldCreateAll) {
	// Check if there are anything that should be ignored
    if(project.globalConsts.excludeFromTsTranspile[platformType] !== undefined) {
        // Get the text from tsConfig file
        let code = fs.readFileSync('tsconfig.json', 'utf8');
        // Store tsConfig text before updating it!
        defaultTsConfigText = code;

        // Create the new exclude text block
	    const replaceInto = `"exclude": ${JSON.stringify(project.globalConsts.excludeFromTsTranspile[platformType])},`;
        // Replace the text from the default one into the updated one!
	    code = code.replace('"exclude": [],', replaceInto);
        // Update file!
	    fs.writeFileSync('tsconfig.json', code, 'utf8');
	}

    tsTranspileBasedOnPlatform(cb, envMode, platformType, shouldCreateAll);
}

// TypeScript Transpile Task
exports.transpileDev = series(tsTranspileDev, updateFwkAndPlatformInfo);
exports.transpileProd = series(tsTranspileProd, updateFwkAndPlatformInfo);