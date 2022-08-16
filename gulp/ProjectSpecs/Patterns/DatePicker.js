/* 
* Pattern Info
**/
const patternInfo = {
    "codeName": "DatePicker",
    "scss": "../scripts/OSFramework/Pattern/DatePicker/scss/datepicker",
    "section": "Interaction",

    "assets": [
        {
            "codeName": "SingleDate",
            "inDevelopment": false,
            "name": "Single Date",
            "provider": {
                "name": "Flatpickr",
                "version": "v4.6.10"
            }
        },
        
        {
            "codeName": "RangeDate",
            "inDevelopment": false,
            "name": "Range Date",
            "provider": {
                "name": "Flatpickr",
                "version": "v4.6.10"
            }
        }
    ]
};

// Expose patterns info!
exports.info = patternInfo;