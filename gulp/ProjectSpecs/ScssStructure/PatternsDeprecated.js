/*
* Section Info
* NOTE: Phase 15 removed the full legacy deprecated-patterns tier (~22 partials). This file
* was restored with only the Wizard entry when merging dev's Wizard redesign, so old markup
* rendered against the previous (non-`.osui-wizard`) Wizard styles keeps working.
**/
const sectionInfo = {
    "name": "Deprecated Patterns",
    "addToSectionIndex": true,

    "assets": [
        {
            "name": "Wizard",
            "path": "10-deprecated/wizard-deprecated"
        }
    ]
};

// Expose section info!
exports.info = sectionInfo;
