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
            './src/scripts/OutSystems/OSUI/Utils/PreviewInDevices/**/*'
        ]
    },
    // list of platforms to compile and create scss files.
    platforms: {
        o11: 'O11',
        odc: 'ODC',
    }
};

// Store the default project specifications
const specs = {
    "version": "2.18.2",
    "name": "OutSystems UI",
    "description": "",
    "url": "Website:\n • https://www.outsystems.com/outsystems-ui",
    "gitHub": "GitHub:\n • https://github.com/OutSystems/outsystems-ui",
}

// Expose sections info!
exports.info = specs;
exports.globalConsts = constants;