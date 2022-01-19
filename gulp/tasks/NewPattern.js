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
    return createTemplate(getTemplateSrc('IPattern'), 'I' + this.patternNamePC, getDestFolder('framework'));
}

// Create Pattern Base
function createPattern(cb) {
    // Create Pattern.ts
    createTemplate(
        getTemplateSrc('Pattern'), 
        (this.hasProvider ? 'Abstract' : '') + this.patternNamePC, 
        getDestFolder('framework')
    );
    
    // Files to be added if HasProvider!
    if(this.hasProvider) {
        // Create PatternFactory.ts
        createTemplate(
            getTemplateSrc((this.hasMode ? 'Provider_HasMode' : 'Provider') + '/PatternFactory'), 
            this.patternNamePC + 'Factory', 
            getDestFolder('framework')
        );

        // Create ProviderEnum.ts
        createTemplate(
            getTemplateSrc((this.hasMode ? 'Provider_HasMode' : 'Provider') + '/ProviderEnum'), 
            (this.hasMode ? 'Abstrat' : '') + this.providerNamePC + 'Enum', 
            getDestFolder('provider')
        );

        // Create Provider.ts
        createTemplate(
            getTemplateSrc((this.hasMode ? 'Provider_HasMode' : 'Provider') + '/Provider'), 
            (this.hasMode ? 'Abstrat' : '') + this.providerNamePC, 
            getDestFolder('provider')
        );

        // Create ProviderConfig.ts
        createTemplate(
            getTemplateSrc((this.hasMode ? 'Provider_HasMode' : 'Provider') + '/ProviderConfig'), 
            (this.hasMode ? 'Abstrat' : '') + this.providerNamePC + 'Config', 
            getDestFolder('provider')
        );

        // Files to be added if HasMode!
        if(this.hasMode) {
            // Create ProviderFactory.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderFactory'), 
                this.providerNamePC + 'Factory', 
                getDestFolder('provider')
            );

            // Create IProvider.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/IProvider'), 
                'I' + this.providerNamePC, 
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
                this.providerNamePC + this.modeNamePC,
                getDestFolder('providerHasMode')
            );
            
            // Create ProviderModeConfig.ts
            createTemplate(
                getTemplateSrc('Provider_HasMode/ProviderModeConfig'), 
                this.providerNamePC + this.modeNamePC + 'Config',
                getDestFolder('providerHasMode')
            );
        }   
    }

    cb();
}

// Create PatternAPI.ts
function createPatternAPI() {    
    return createTemplate(getTemplateSrc('PatternAPI'), this.patternNamePC+'API', getDestFolder('api'));
}

// Create PatternConfig.ts
function createPatternConfig() {
    return createTemplate(
                getTemplateSrc('PatternConfig'),
                (this.hasProvider ? 'Abstract' : '') + this.patternNamePC + 'Config', 
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
        '_'+this.patternNameLC,
        getDestFolder('framework')+'/scss'
    );

    // Files to be added if HasProvider!
    if(this.hasProvider) {
        createTemplate(
            getTemplateSrc('scss/_provider-lib'), 
            '_'+this.providerNameLC+'-lib',
            getDestFolder('provider')+'/scss'
        );

        createTemplate(
            getTemplateSrc('scss/_provider'), 
            '_'+this.providerNameLC,
            getDestFolder('provider')+'/scss'
        );
    }

    cb();
}

// Create file based on given template
function createTemplate(templaceSrc, renameTo, destFolder) {
    return gulp.src(templaceSrc)
        .pipe(template({
            modeName: this.modeName,
            modeNamePC: this.modeNamePC,
            patternName: this.patternName,
            patternNameLC: this.patternNameLC,
            patternNamePC: this.patternNamePC,
            providerName: this.providerName,
            providerNameLC: this.providerNameLC,
            providerNamePC: this.providerNamePC
        }))
        .pipe(rename({
            basename: renameTo
        }))
        .pipe(gulp.dest(destFolder));
}

// Get the destination folder based on a templateType
function getDestFolder(templateType) {
    let destSrc;
    
    switch (templateType) {
        case 'api':
            destSrc = this.destFolder === undefined ? 
                './src/scripts/OutSystems/OSUI/Patterns/' : 
                this.destFolder;
            break;
        case 'framework':
            destSrc = this.destFolder === undefined ? 
                './src/scripts/OSUIFramework/Pattern/'+this.patternNamePC :
                this.destFolder+'/Pattern/'+this.patternNamePC;
            break;
        case 'provider':
            destSrc = this.destFolder === undefined ? 
                './src/scripts/Providers/'+this.patternNamePC+'/'+this.providerNamePC : 
                this.destFolder+'/Providers/'+this.patternNamePC+'/'+this.providerNamePC;
            break;
        case 'providerHasMode':
            destSrc = this.destFolder === undefined ? 
                './src/scripts/Providers/' + this.patternNamePC+'/'+this.providerNamePC+'/'+this.modeNamePC : 
                this.destFolder+'/Providers/'+this.patternNamePC+'/'+this.providerNamePC+'/'+this.modeNamePC
            break;

    }
    
    return destSrc;
}

// Get template source according given template name
function getTemplateSrc(templateName) {
    let templateSrc;

    if(templateName === 'PatternAPI') {
        templateSrc = './gulp/templates/PatternAPI' + (this.hasProvider ? '_HasProvider' : '') +'.ts';
    }
    else {
        templateSrc = './gulp/templates/PatternFramework' + 
                            (this.hasProvider ? '_HasProvider' : '') +'/'+ 
                            templateName + 
                            (templateName.indexOf('scss/') === -1 ? '.ts' : '.scss'); 
    }

    return templateSrc;
}

// Show info as final notes!
function finalNotes(cb) {
    console.log('-----------------------------------------------------------------------------------\n');
    console.log('   Created new "'+ this.patternNamePC +'" Pattern'+(this.hasProvider ? "," : "!"));
    if(this.hasProvider){
        console.log('   with "'+ this.providerNamePC +'" as a Provider'+(this.hasMode ? "," : "!"));

        if(this.hasMode){
            console.log('   and "'+ this.modeNamePC +'" as a Mode!');
        }
    }
    console.log('\n   NOTE:');
    console.log('      - Search now for "TODO (by CreateNewPattern)" and act accordingly...');
    console.log('\n-----------------------------------------------------------------------------------');
    cb();
}

// Prepare info to create new pattern
function setPatternConfig(cb) {
    gulp.src('gulp/templates/PatternAPI.ts')
        .pipe(confirm({
            question: 'Pattern Name? (do not forget to use camelCase)',
            proceed: function(answer) {
                if(/[^a-zA-Z]/.test(answer)){
                    cb(new Error('Pattern name must contain only letters without spaces!'));
                }

                this.patternName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                this.patternNameLC = answer.toLowerCase();
                this.patternNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                return true;
            }
        }))
        .pipe(confirm({
            question: 'Provider? Give it a name (camelCase), or hit ENTER',
            proceed: function(answer) {
                if(/[^a-zA-Z]/.test(answer)){
                    cb(new Error('Provider name must contain only letters without spaces!'));
                }
                else if(!/\S+/.test(answer)) {
                    return true;
                }

                this.hasProvider = true;
                this.providerName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                this.providerNameLC = answer.toLowerCase();
                this.providerNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                return true;
            }
        }))
        .pipe(confirm({
            question: 'Mode? Give it a name (camelCase), or hit ENTER',
            proceed: function(answer) {
                if(/[^a-zA-Z]/.test(answer)){
                    cb(new Error('Mode name must contain only letters without spaces!'));
                }
                else if(!/\S+/.test(answer)) {
                    return true;
                }

                this.hasMode = true;
                this.modeName = answer[0].toLowerCase() + answer.substring(1, answer.length);
                this.modeNamePC = answer[0].toUpperCase() + answer.substring(1, answer.length);
                return true;
            }
        }))
        .pipe(confirm({
            question: 'Custom destination Folder? Type folder source name, or hit ENTER',
            proceed: function(answer) {
                if(/[^A-Za-z/]/.test(answer)){
                    cb(new Error('Destination src can not contain spaces and special chars (except "/")!'));
                }
                if(answer === '') {
                    return true;
                }

                this.destFolder = answer;
                return true;
            }
        }))

    cb();
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