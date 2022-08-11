/* 
* Pattern Info
**/
const patternInfo = {
    "code-name": "DatePicker",
    "scss": "../scripts/OSFramework/Pattern/DatePicker/scss/datepicker",
    "section": "Interaction",

    "single": {
        "code-name": "SingleDate",
        "in-development": false,
        "name": "Single Date",
        "provider": {
            "name": "Flatpickr",
            "version": "v4.6.10"
        }
    },

    "range": {
        "code-name": "RangeDate",
        "in-development": false,
        "name": "Range Date",
        "provider": {
            "name": "Flatpickr",
            "version": "v4.6.10"
        }
    }
};

// Expose patterns info!
exports.info = patternInfo;