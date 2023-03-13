const fs = require('fs');

const getSectionIndexText = require('./CreateScss/SectionIndex');
const getPartialsList = require('./CreateScss/GetPartialsList');

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
	notes += `PS: This comment will not be visible at the compiled version!\n`;
	notes +=	"=============================================================================== */\n";

	return notes;
}

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	// Store the Section Index generated text
	const sectionIndexText = env === envType.production ? getSectionIndexText.textProd() : getSectionIndexText.textDev();
	// Store the Partials List generated text
	const partialsText = env === envType.production ? getPartialsList.textProd() : getPartialsList.textDev();

	// Combine text to create the hole file
	const newScssText = `${getNotesText()}\n${sectionIndexText}\n${partialsText}`;

    // Update the SCSS file with the generated code!
    fs.writeFileSync(`./src/scss/OutSystemsUI.scss`, newScssText, 'utf8');

	cb();
}

exports.update_osui_scss_file_dev = setDevEnvironment;
exports.update_osui_scss_file_prod = setProdEnvironment;