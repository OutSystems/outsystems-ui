/* 
* Pattern Info
**/
const patternInfo = {
    "codeName": "Dropdown",
    "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown",
    "section": "Interaction",

    "assets": [
        {
            "codeName": "Search",
            "inDevelopment": true,
            "name": "Dropdown Search",
            "provider": {
                "name": "VirtualSelect",
                "version": "v1.0.31"
            },
            "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-search"
        },
        
        {
            "codeName": "Tags",
            "inDevelopment": false,
            "name": "Dropdown Tags",
            "provider": {
                "name": "VirtualSelect",
                "version": "v1.0.31"
            },
            "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-tags"
        },
        
        {
            "codeName": "ServerSide",
            "inDevelopment": true,
            "name": "Dropdown ServerSide",
            "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-serverside"
        }
    ]
};

// Expose patterns info!
exports.info = patternInfo;