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
            "inDevelopment": false,
            "name": "Dropdown Search",
            "scss": "../scripts/OSFramework/Pattern/Dropdown/scss/dropdown-search"
        },
        
        {
            "codeName": "Tags",
            "inDevelopment": false,
            "name": "Dropdown Tags",
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