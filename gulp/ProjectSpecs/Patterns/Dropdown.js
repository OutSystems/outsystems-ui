/* 
* Pattern Info
**/
const patternInfo = {
    "code-name": "Dropdown",
    "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown",
    "section": "Interaction",

    "search": {
        "code-name": "Search",
        "in-development": false,
        "name": "Dropdown Search",
        "provider": {
            "name": "VirtualSelect",
            "version": "v1.0.31"
        },
        "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-search"
    },

    "tags": {
        "code-name": "Tags",
        "in-development": false,
        "name": "Dropdown Tags",
        "provider": {
            "name": "VirtualSelect",
            "version": "v1.0.31"
        },
        "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-tags"
    },

    "serverside": {
        "code-name": "ServerSide",
        "in-development": true,
        "name": "Dropdown ServerSide",
        "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-serverside"
    }
};

// Expose patterns info!
exports.info = patternInfo;