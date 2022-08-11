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
    "add-to-section-index": true,

    "adaptive": patternsAdaptive.info,
    "content": patternsContent.info,
    "interaction": patternsInteraction.info,
    "navigation": patternsNavigation.info,
    "numbers": patternsNumbers.info,
    "utilities": patternsUtilities.info,
    "deprectaed": patternsDeprecated.info,
};

// Expose section info!
exports.info = sectionInfo;