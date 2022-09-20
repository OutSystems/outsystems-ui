// Get the reference file for each section
const setupVariables = require('./SetupVariables');
const functionsAndMixins = require('./Functions&Mixins');
const root = require('./Root');
const resets = require('./Resets');
const htmlElements = require('./HTMLElements');
const pageLayout = require('./PageLayout');
const widgets = require('./Widgets');
const patterns = require('./Patterns');
const usefullClasses = require('./UsefullClasses');
const screenTransitions = require('./ScreenTransitions');
const keyframes = require('./Keyframes');
const serviceStudioPreview = require('./ServiceStudioPreview');
const excluders = require('./Excluders');

/* 
* List of all sections that will be added to the scss to be them compiled into css
**/
const cssStructure = {
	"css-variables-setup": setupVariables.info,
	"functions-mixins": functionsAndMixins.info,
	"root": root.info,
	"resets": resets.info,	
	"html-elements": htmlElements.info,
	"page-layout": pageLayout.info,
	"widgets": widgets.info,
	"patterns": patterns.info,
	"usefull-classes": usefullClasses.info,
	"screen-transitions": screenTransitions.info,
	"keyframes-animations": keyframes.info,
	"ss-preview": serviceStudioPreview.info,
	"excluders": excluders.info
}

// Expose the scssStructure info!
exports.structure = cssStructure;