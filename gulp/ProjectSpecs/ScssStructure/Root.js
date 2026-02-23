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
            "name": "",
            "path": "01-foundations/icon-library",
            "platform": project.globalConsts.platformTarget.odc
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;