const fs = require('fs');

const project = require('../ProjectSpecs/DefaultSpecs');
const patterns = require('../ProjectSpecs/Patterns/#All');
const scssStructure = require('../ProjectSpecs/ScssStructure/#All');

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	// // Get file content
	// const fileContents = fs.readFileSync('./gulp/ProjectSpecs/ProjectSpecs.json', 'utf8');
	// fs.writeFileSync('tsconfig.json', code, 'utf8');
    
	console.log(project.specs);
	// console.log(patterns.all);
	// console.log(scssStructure.structure);
	


	cb();
}



exports.create_osui_scss_file = createScssFile;