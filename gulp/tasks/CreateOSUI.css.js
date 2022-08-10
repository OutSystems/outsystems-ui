const gulp = require('gulp');
const { series } = require('gulp');

const fs = require('fs');


function demoChangeTsConfig(cb) {
	const fileContents = fs.readFileSync('./gulp/tasks/ProjectSpecs.json', 'utf8');
    const specs = JSON.parse(fileContents).osui;
    

	console.log(specs);

	// fs.writeFileSync('tsconfig.json', code, 'utf8');

	cb();
}



exports.create_osui_scss_file = demoChangeTsConfig;