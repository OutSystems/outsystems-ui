const { series, parallel } = require('gulp');
const fs = require('fs');

const getSectionIndexText = require('./CreateScss/SectionIndex');
const getPartialsList = require('./CreateScss/GetPartialsList');

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	const newScssText = getSectionIndexText.text;

	const partialsList = getPartialsList.text;

	cb();
}

exports.create_osui_scss_file = series(createScssFile);