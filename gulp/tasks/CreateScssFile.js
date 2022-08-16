const { series, parallel } = require('gulp');
const fs = require('fs');

const sectionIndex = require('./CreateScss/SectionIndex');

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	// const a = sectionIndex.devStructure;
	const b = sectionIndex.devStructure;

	console.log(b);

	cb();
}

exports.create_osui_scss_file = series(createScssFile);