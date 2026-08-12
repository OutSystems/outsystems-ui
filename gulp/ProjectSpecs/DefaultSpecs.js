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
    // list of platforms to compile (TypeScript bundles).
    platformTarget: {
        o11: 'O11',
        odc: 'ODC',
    },
    // list of platforms for which to generate + compile SCSS bundles.
    // Subset of platformTarget. O11 was disabled during the token migration
    // (Phase 15b) and re-enabled once the new theme was ready to ship to O11 (ROU-12974).
    scssPlatformTarget: {
        o11: 'O11',
        odc: 'ODC',
    },
    // Icon placeholder CSS class per platform (replaced at compile time; do not change token in source).
    iconPlaceholderClass: {
        o11: 'ph placeholder-empty',
        odc: 'placeholder-empty',
    },
};

// Store the default project specifications
const specs = {
    "version": "2.30.0",
    "name": "OutSystems UI",
    "description": "",
    "url": "Website:\n • https://www.outsystems.com/outsystems-ui",
    "gitHub": "GitHub:\n • https://github.com/OutSystems/outsystems-ui",
}

// Expose sections info!
exports.info = specs;
exports.globalConsts = constants;