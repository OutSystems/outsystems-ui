const { series, parallel } = require('gulp');
const fs = require('fs');

const project = require('../ProjectSpecs/DefaultSpecs');
const patterns = require('../ProjectSpecs/Patterns/#All');
const scssStructure = require('../ProjectSpecs/ScssStructure/#All');

// Store text that will be added as SectionIndex
let indexSection = '';

// Method that will create the text for the SectionIndex section dynamically
function createIndexSectiom(cb) {
	let sectionIndexInteractor = 0;
	let sectionAssetsInteractor = 0;
	let subSectionAssetsInteractor = 0;
	
	// Start Index Section
	indexSection += `/*!\n`;
	indexSection += `* ${project.info.name} ${project.info.version}\n`;
	indexSection += `* ${project.info.url}\n`;
	if(project.info.description !== '') {
		indexSection += `* ${project.info.description}\n`;
	}
	indexSection += `*\n`;
	indexSection += `* Section Index\n`;
	
	// 1st Level - Go through all the sections
	for(const section in scssStructure.structure ) {
		const sectionInfo = scssStructure.structure[section];
		// Check if the given section should be added to the SectionIndex
		if(sectionInfo.addToSectionIndex) {			
			indexSection += `*  ${sectionIndexInteractor}. ${sectionInfo.name}\n`;			
			// Check if the section has no subSections
			if(sectionInfo.assets !== undefined) {
				sectionAssetsInteractor = 1;
				// 2nd Level - Go through each SectionAsset
				for(const sectionAsset of sectionInfo.assets ) {
					// If Asset Section does not have a name, it should not be visible at SectionIndex
					if(sectionAsset.name !== undefined && sectionAsset.name !== ''){
						indexSection += `*   ${sectionIndexInteractor}.${sectionAssetsInteractor}. ${sectionAsset.name}\n`;
						// Check if section also has subSections (eg: patterns)
						if(sectionAsset.assets !== undefined) {
							subSectionAssetsInteractor = 1;
							// 3rd Level - Go through each subSectionAsset
							for(const subSectionAsset of sectionAsset.assets ) {
								indexSection += `*     ${sectionIndexInteractor}.${sectionAssetsInteractor}.${subSectionAssetsInteractor}`;
								// Get subSection info from global patterns object
								if(subSectionAsset.key !== undefined){
									indexSection += `. ${ patterns.all[subSectionAsset.key].name}\n`;
								} else {
									// Check if all the info for the subSection is avaible
									indexSection += `. ${subSectionAsset.name}\n`;
								}
								subSectionAssetsInteractor++;
							}
						}
						sectionAssetsInteractor++;
					}
				}
			}		
			sectionIndexInteractor++;
		}
	}
	indexSection += `*/\n`;
	cb();
}

// Method used to Create SCSS file structure dynamically
function createScssFile(cb) {
	console.log(indexSection);

	cb();
}



exports.create_osui_scss_file = series(parallel(createIndexSectiom), createScssFile);