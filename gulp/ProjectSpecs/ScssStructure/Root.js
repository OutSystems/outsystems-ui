const project = require('../DefaultSpecs');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Root - CSS Variables",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "",
            "path": "01-foundations/root"
        },
        {
            "name": "Icon library",
            "path": "01-foundations/icon-library-odc",
            "platform": project.globalConsts.platformTarget.odc
        },
        {
            "name": "Icon library",
            "path": "01-foundations/icon-library-o11",
            "platform": project.globalConsts.platformTarget.o11
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;