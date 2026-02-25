const project = require('../DefaultSpecs');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Service Studio Preview",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "",
            "path": "08-servicestudio-preview/servicestudiopreview"
        },
        {
            "name": "",
            "path": "08-servicestudio-preview/placeholder-empty-o11",
            "platform": project.globalConsts.platformTarget.o11
        },
        {
            "name": "",
            "path": "08-servicestudio-preview/placeholder-empty-odc",
            "platform": project.globalConsts.platformTarget.odc
        },
        {
            "name": "",
            "path": "08-servicestudio-preview/deprecated-preview"
        }
    ]
}

// Expose section info!
exports.info = sectionInfo;