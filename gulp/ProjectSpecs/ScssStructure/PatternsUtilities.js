const project = require('../DefaultSpecs');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Utilities",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "Align Center",
            "path": "04-patterns/06-utilities/align-center"
        },
        {
            "key": "button-loading"
        },
        {
            "name": "Center Content",
            "path": "04-patterns/06-utilities/center-content"
        },
        {
            "name": "Margin Container",
            "path": "04-patterns/06-utilities/margin-container"
        },
        {
            "name": "Separator",
            "path": "04-patterns/06-utilities/separator"
        },
        {
            "name": "Pull to Refresh",
            "path": "04-patterns/06-utilities/pull-to-refresh"
        },
        {
            "name": "List Updating",
            "path": "04-patterns/06-utilities/list-updating"
        }
        ,
        {
            "name": "Provider Login Button",
            "path": "04-patterns/06-utilities/provider-login-button",
            "platform": project.globalConsts.platforms.odc,
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;