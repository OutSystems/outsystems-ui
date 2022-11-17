const gulp = require('gulp');
const { series } = require('gulp');

const rename = require('gulp-rename');
const template = require('gulp-template');
const confirm = require('gulp-confirm');

let destFolder = '',
    patternName = '', patternNameLC = '', patternNamePC = '',
    hasProvider = false, providerName = '', providerNameLC = '', providerNamePC = '',
    hasMode = false, modeName = '', modeNamePC = '';

// Create Pattern Interface
function createIPattern() {
    return createTemplate(getTemplateSrc('IPattern'), 'I' + patternNamePC, getDestFolder('framework'));
}

// Create Pattern Base
function createPattern(cb) {
    // Create Pattern.ts
    createTemplate(
        getTemplateSrc('Pattern'), 
        (hasProvider ? 'Abstract' : '') + patternNamePC, 
        getDestFolder('framework')
    );
    
    // Files to be added if HasProvider!
    if(hasProvider) {
        // Create README.md
        createTemplate(
            getTemplateSrc('ProviderReadMe'), 
            'README', 
            getDestFolder('provider')
        );

        // Create PatternFactory.ts
        createTemplate(
            getTemplateSrc((hasMode ? 'Provider_HasMode' : 'Provider') + '/PatternFactory'), 
            patternNamePC + 'Factory', 
            getDestFolder('framework')
        );

        // Create ProviderEnum.ts
        createTemplate(
            getTemplateSrc((hasMode ? 'Provider_HasMode' : 'Provider') + '/ProviderEnum'), 
            (hasMode ? 'Abstrat' : '') + providerNamePC + 'Enum', 
            getDestFolder('provider')
        );

        // Create Provider.ts
        createTemplate(
            getTemplateSrc((hasMode ? 'Provider_HasMode' : 'Provider') + '/Provider'), 
            (hasMode ? 'Abstrat' : '') + providerNamePC, 
            getDestFolder('provider')
        );

        // Create ProviderConfig.ts
        createTemplate(
            getTemplateSrc((hasMode ? 'Provider_HasMode' : 'Provider') + '/ProviderConfig'), 
            (hasMode ? 'Abstrat' : '') + providerNamePC + 'Config', 
            getDestFolder('provider')
        );

        // Files to be added if HasMode!
        if(hasMode) {
            // Create ProviderFactory.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderFactory'), 
                providerNamePC + 'Factory', 
                getDestFolder('provider')
            );

            // Create IProvider.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/IProvider'), 
                'I' + providerNamePC, 
                getDestFolder('provider')
            );

            // Create ProviderModeEnum.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderModeEnum'), 
                'Enum',
                getDestFolder('providerHasMode')
            );

            // Create ProviderMode.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderMode'), 
                providerNamePC + modeNamePC,
                getDestFolder('providerHasMode')
            );
            
            // Create ProviderModeConfig.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderModeConfig'), 
                providerNamePC + modeNamePC + 'Config',
                getDestFolder('providerHasMode')
            );
        }   
    }

    cb();
}

// Create PatternAPI.ts
function createPatternAPI() {
    return createTemplate(getTemplateSrc('PatternAPI'), patternNamePC+'API', getDestFolder('api'));
}

// Create PatternConfig.ts
function createPatternConfig() {
    return createTemplate(
                getTemplateSrc('PatternConfig'),
                (hasProvider ? 'Abstract' : '') + patternNamePC + 'Config', 
                getDestFolder('framework')
            );
}

// Create Pattern Enum.ts
function createPatternEnum() {
    return createTemplate(getTemplateSrc('PatternEnum'), 'Enum', getDestFolder('framework'));
}

// Create SCSS partial files
function createScss(cb) {
    // Create _pattern.scss
    createTemplate(
        getTemplateSrc('scss/_pattern'), 
        '_'+patternNameLC,
        getDestFolder('framework')+'/scss'
    );

    // Files to be added if HasProvider!
    if(hasProvider) {
        createTemplate(
            getTemplateSrc('scss/_provider-lib'), 
            '_'+providerNameLC+'-lib',
            getDestFolder('provider')+'/scss'
        );

        createTemplate(
            getTemplateSrc('scss/_provider'), 
            '_'+providerNameLC,
            getDestFolder('provider')+'/scss'
        );
    }

    cb();
}

// Create file based on given template
function createTemplate(templaceSrc, renameTo, addToFolder) {
    return gulp.src(templaceSrc)
        .pipe(template({
            modeName: modeName,
            modeNamePC: modeNamePC,
            patternName: patternName,
            patternNameLC: patternNameLC,
            patternNamePC: patternNamePC,
            providerName: providerName,
            providerNameLC: providerNameLC,
            providerNamePC: providerNamePC
        }))
        .pipe(rename({
            basename: renameTo
        }))
        .pipe(gulp.dest(addToFolder));
}

// Get the destination folder based on a templateType
function getDestFolder(templateType) {
    let destSrc;
    
    switch (templateType) {
        case 'api':
            destSrc = destFolder === '' ? 
                './src/scripts/OutSystems/OSUI/Patterns/' : 
                destFolder;
            break;
        case 'framework':
            destSrc = destFolder === '' ? 
                './src/scripts/OSFramework/Pattern/'+patternNamePC :
                destFolder+'/Pattern/'+patternNamePC;
            break;
        case 'provider':
            destSrc = destFolder === '' ? 
                './src/scripts/Providers/'+patternNamePC+'/'+providerNamePC : 
                destFolder+'/Providers/'+patternNamePC+'/'+providerNamePC;
            break;
        case 'providerHasMode':
            destSrc = destFolder === '' ? 
                './src/scripts/Providers/' + patternNamePC+'/'+providerNamePC+'/'+modeNamePC : 
                destFolder+'/Providers/'+patternNamePC+'/'+providerNamePC+'/'+modeNamePC
            break;

    }
    
    return destSrc;
}

// Get template source according given template name
function getTemplateSrc(templateName) {
    let templateSrc;

    switch (templateName) {
        case 'PatternAPI':
            templateSrc = './gulp/templates/PatternAPI' + 
                            (hasProvider ? '_HasProvider' : '') +
                            (hasProvider && hasMode ? 'AndMode' : '') +
                            '.ts';
            break;
        case 'ProviderReadMe':
            templateSrc = './gulp/templates/PatternFramework_HasProvider/ProviderReadMe.md';
            break;
        default:
            templateSrc = './gulp/templates/PatternFramework' + 
                            (hasProvider ? '_HasProvider' : '') +'/'+ 
                            templateName + 
                            (templateName.indexOf('scss/') === -1 ? '.ts' : '.scss'); 
    }

    return templateSrc;
}

// Show info as final notes!
function finalNotes(cb) {
    console.log('-----------------------------------------------------------------------------------\n');
    console.log('   Created new "'+ patternNamePC +'" Pattern'+(hasProvider ? "," : "!"));
    if(hasProvider){
        console.log('   with "'+ providerNamePC +'" as a Provider'+(hasMode ? "," : "!"));

        if(hasMode){
            console.log('   and "'+ modeNamePC +'" as a Mode!');
        }
    }
    console.log('\n   NOTE:');
    console.log('      - Search now for "TODO (by CreateNewPattern)" and act accordingly...');
    console.log('\n-----------------------------------------------------------------------------------');
    cb();
}

// Prepare info to create new pattern
function setPatternConfig() {
    return gulp.src('gulp/templates/PatternAPI.ts')
            .pipe(confirm({
                question: 'Pattern Name? (do not forget to use camelCase)',
                proceed: function(answer) {
                    if(/[^a-zA-Z]/.test(answer)){
                        cb(new Error('Pattern name must contain only letters without spaces!'));
                    }

                    patternName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                    patternNameLC = answer.toLowerCase();
                    patternNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                    return true;
                }
            }))
            .pipe(confirm({
                question: 'Provider? Give it a name (camelCase), or hit ENTER to skip',
                proceed: function(answer) {
                    if(/[^a-zA-Z]/.test(answer)){
                        cb(new Error('Provider name must contain only letters without spaces!'));
                    }
                    else if(!/\S+/.test(answer)) {
                        return true;
                    }

                    hasProvider = true;
                    providerName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                    providerNameLC = answer.toLowerCase();
                    providerNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                    return true;
                }
            }))
            .pipe(confirm({
                question: 'Mode? Give it a name (camelCase), or hit ENTER to skip',
                proceed: function(answer) {
                    if(/[^a-zA-Z]/.test(answer)){
                        cb(new Error('Mode name must contain only letters without spaces!'));
                    }
                    else if(!/\S+/.test(answer)) {
                        return true;
                    }

                    hasMode = true;
                    modeName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                    modeNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                    return true;
                }
            }))
            .pipe(confirm({
                question: 'Custom destination Folder? Type folder source name, or hit ENTER to skip',
                proceed: function(answer) {
                    if(/[^A-Za-z/]/.test(answer)){
                        cb(new Error('Destination src can not contain spaces and special chars (except "/")!'));
                    }
                    if(answer === '') {
                        return true;
                    }

                    destFolder = answer;
                    return true;
                }
            }))
}

// Create new Pattern task
exports.create = series(
    setPatternConfig,
    createPatternAPI,
    createPatternEnum,
    createIPattern,
    createPatternConfig,
    createPattern,
    createScss,
    finalNotes
);