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

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	// Store the Section Index generated text
	const sectionIndexText = env === envType.production ? getSectionIndexText.textProd : getSectionIndexText.textDev;
	// Store the Partials List generated text
	const partialsText = env === envType.production ? getPartialsList.textProd : getPartialsList.textDev;

	// Combine text to create the hole file
	const newScssText = `${sectionIndexText}\n${partialsText}`;
	console.log(newScssText);

    // Update the SCSS file with the generated code!
    // fs.writeFileSync(`./src/scss/OutSystemsUI.scss`, newScssText, 'utf8');

	cb();
}

exports.update_osui_scss_file_dev = setDevEnvironment;
exports.update_osui_scss_file_prod = setProdEnvironment;