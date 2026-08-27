const fs = require('fs');

const getPartialsList = require('./CreateScss/GetPartialsList');
const getSectionIndexText = require('./CreateScss/SectionIndex');
const project = require('../ProjectSpecs/DefaultSpecs');

// Name of the single CSS cascade layer that wraps the whole compiled bundle.
// Every OutSystems UI rule is emitted inside `@layer outsystems-ui { … }` so that
// any unlayered app CSS overrides it regardless of specificity — without touching
// the framework's own internal cascade (within one layer, specificity + source
// order behave exactly as before). See specs/cascade-layers.md (Option A).
const cascadeLayerName = 'outsystems-ui';

// Wrap the generated partials (@import block) in the cascade layer. Dart Sass
// inlines each @import at its location, so all rules land inside the layer;
// @keyframes / @font-face are collected globally and unaffected, and :root
// custom-property declarations stay overridable by an unlayered :root.
function wrapInCascadeLayer(partialsText) {
	return `@layer ${cascadeLayerName} {\n\n${partialsText}\n}\n`;
}

function setDevEnvironment (cb) {
	createScssFile(cb, project.globalConsts.envType.development);
}

function setProdEnvironment (cb) {
	createScssFile(cb, project.globalConsts.envType.production);
}

// Create a file note to give important context!
function getNotesText () {
	let notes = '';

	notes += ""
	notes = "/* ===============================================================================\n";
	notes += `IMPORTANT NOTE:\n`;
	notes += `• This file is generated automatically through npm scripts: \n`;
	notes += `├── npm run create-osui-scss \n`;
	notes += `|	└── Which will recreate this file as a Dev mode. \n`;
	notes += `|\n`;
	notes += `├── npm run build \n`;
	notes += `|	└── When Prod mode is being start, it will be recreated before it's compilation. \n`;
	notes += `|\n`;
	notes += `└── npm run dev \n`;
	notes += `	└── When Dev mode is being start, it will be recreated, than the compilation will occurs as usually. \n`;
	notes += `\n`;
	notes += `• In order to proper manage this file, use:\n`;
	notes += `└── './gulp/ProjectSpecs/ScssStructure/#All.js' \n`;
	notes += `\n`;
	notes += `PS: This comment block will not be visible in the compiled version!\n`;
	notes +=	"=============================================================================== */\n";

	return notes;
}

// Memthod that will create the file content text and return it depending on platform type
function getFileText(platformType, envType) {
	// Store the Section Index generated text
	const sectionIndexText = envType === project.globalConsts.envType.production ? getSectionIndexText.textProd(platformType) : getSectionIndexText.textDev(platformType);
	// Store the Partials List generated text
	const partialsText = envType === project.globalConsts.envType.production ? getPartialsList.textProd(platformType) : getPartialsList.textDev(platformType);
	// Combine text to create the hole file — the partials are wrapped in a CSS cascade layer
	return `${getNotesText()}\n${sectionIndexText}\n${wrapInCascadeLayer(partialsText)}`;
}

// Method used to Create SCSS file structure dynamically
function createScssFile(cb, envType) {
	const pts = project.globalConsts.scssPlatformTarget;
	for(const pt in pts) {
        fs.writeFileSync(`./src/scss/${pts[pt]}.OutSystemsUI.scss`, getFileText(pts[pt], envType), 'utf8');
    }
	cb();
}

exports.update_osui_scss_file_dev = setDevEnvironment;
exports.update_osui_scss_file_prod = setProdEnvironment;