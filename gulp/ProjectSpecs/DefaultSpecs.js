/* 
* Global constants info
**/
const constants = {
    envType: {
        development: 'dev', 
        production: 'prod'
    },
    // list of files to be excluded from a specific platform
    excludeFromTsTranspile: {
        O11: [
            './src/scripts/OutSystems/OSUI/Utils/PreviewInDevices/**/*',
            './src/scripts/OutSystems/OSUI/Utils/IconLibrary.ts'
        ]
    },
    // list of platforms to compile and create scss files.
    platformTarget: {
        o11: 'O11',
        odc: 'ODC',
    },
    // Icon placeholder CSS class per platform (replaced at compile time; do not change token in source).
    iconPlaceholderClass: {
        o11: 'ph',
        odc: 'placeholder-empty',
    },
};

// Store the default project specifications
const specs = {
    "version": "2.28.0",
    "name": "OutSystems UI",
    "description": "",
    "url": "Website:\n • https://www.outsystems.com/outsystems-ui",
    "gitHub": "GitHub:\n • https://github.com/OutSystems/outsystems-ui",
}

// Expose sections info!
exports.info = specs;
exports.globalConsts = constants;