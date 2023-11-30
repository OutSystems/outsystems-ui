const fs = require('fs');

const getSectionIndexText = require('./CreateScss/SectionIndex');
const getPartialsList = require('./CreateScss/GetPartialsList');
const constants = require('../ProjectSpecs/ScssStructure/#Constants');

const envType = {'development':'dev', 'production':'prod'}
let env = '';

function setDevEnvironment (cb) {
	env = envType.development;
	createScssFile(cb);
}

function setProdEnvironment (cb) {
	env = envType.production;
	createScssFile(cb);
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
	notes += `PS: This comment block will not be visible at the compiled version!\n`;
	notes +=	"=============================================================================== */\n";

	return notes;
}

// Memthod that will create the file content text and return it depending on platform type
function getFileText(platformType) {
	// Store the Section Index generated text
	const sectionIndexText = env === envType.production ? getSectionIndexText.textProd(platformType) : getSectionIndexText.textDev(platformType);
	// Store the Partials List generated text
	const partialsText = env === envType.production ? getPartialsList.textProd(platformType) : getPartialsList.textDev(platformType);
	// Combine text to create the hole file
	return `${getNotesText()}\n${sectionIndexText}\n${partialsText}`;
}

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
    // Set/Update the SCSS file with the generated code for the O11 platform
    fs.writeFileSync(`./src/scss/O11.OutSystemsUI.scss`, getFileText(constants.info.platforms.o11), 'utf8');

    // Set/Update the SCSS file with the generated code for the ODC platform
    fs.writeFileSync(`./src/scss/ODC.OutSystemsUI.scss`, getFileText(constants.info.platforms.odc), 'utf8');

	cb();
}

exports.update_osui_scss_file_dev = setDevEnvironment;
exports.update_osui_scss_file_prod = setProdEnvironment;