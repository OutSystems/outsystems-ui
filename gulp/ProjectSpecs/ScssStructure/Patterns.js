// Get the reference file for each pattern section
const patternsAdvanced = require('./PatternsAdvanced');
const patternsAdaptive = require('./PatternsAdaptive');
const patternsContent = require('./PatternsContent');
const patternsInteraction = require('./PatternsInteraction');
const patternsNavigation = require('./PatternsNavigation');
const patternsNumbers = require('./PatternsNumbers');
const patternsUtilities = require('./PatternsUtilities');

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
        patternsAdvanced.info
    ]
};

// Expose section info!
exports.info = sectionInfo;