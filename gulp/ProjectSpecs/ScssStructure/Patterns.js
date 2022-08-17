// Get the reference file for each pattern section
const patternsAdaptive = require('./PatternsAdaptive');
const patternsContent = require('./PatternsContent');
const patternsInteraction = require('./PatternsInteraction');
const patternsNavigation = require('./PatternsNavigation');
const patternsNumbers = require('./PatternsNumbers');
const patternsUtilities = require('./PatternsUtilities');
const patternsDeprecated = require('./PatternsDeprecated');

/* 
* Section Info
**/
const sectionInfo = {
    "name": "Patterns",
    "addToSectionIndex": true,

    "assets": [
        patternsAdaptive.info,
        patternsContent.info,
        patternsInteraction.info,
        patternsNavigation.info,
        patternsNumbers.info,
        patternsUtilities.info,
        patternsDeprecated.info
    ]
};

// Expose section info!
exports.info = sectionInfo;