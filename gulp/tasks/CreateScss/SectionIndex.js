const project = require('../../ProjectSpecs/DefaultSpecs');
const patterns = require('../../ProjectSpecs/Patterns/#All');
const scssStructure = require('../../ProjectSpecs/ScssStructure/#All');

const envType = {'development':'dev', 'production':'prod'}
let env = envType.development;
// Store text that will be added as SectionIndex
let indexSection = '';

// Used to define the initialization of each line
function getStartLine(sectionLevel = 0, section1Index = -1, section2Index = -1, section3Index = -1) {
	let text = '';
	switch (sectionLevel) {
		case 0:
			text += `* ${section1Index}. `;
			break;
		case 1:
			text += `*   ${section1Index}.${section2Index}. `;
			break;
		case 2:
			text += `*     ${section1Index}.${section2Index}.${section3Index}. `;
			break;
	}

	return text;
}

// Used to return the text line
function getLineText(lineStart, text) {
	return `${lineStart}${text}\n`;
}

// 3nd Level - Method used to go through each 3nd level of sectionAssets
function goThrough3ndLevelSections(
			sectionAssets, 
			parent1stSectionIndex, 
			parent2ndSectionIndex
		) {
	let sectionIndex = 0;
	// Store text that will be returned from this method!
	let text = '';

	// 3rd Level - Go through each subSectionAsset
	for(const section of sectionAssets ) {
		// Get subSection info from global patterns object (eg: patterns)
		if(section.key !== undefined) {
			const patternKeyInfo = patterns.all[section.key];

			if(env === envType.production && patternKeyInfo.inDevelopment === true) {
				continue;
			}
			
			// Check if pattern has Assets - It means it contains subPatterns
			if(patternKeyInfo.assets !== undefined) {
				for(const subPattern of patternKeyInfo.assets ) {
					if(env === envType.production && subPattern.inDevelopment === true) {
						continue;
					}

					text += getLineText(
						getStartLine(2, parent1stSectionIndex, parent2ndSectionIndex, sectionIndex),
						subPattern.name
					);

					if(subPattern !== patternKeyInfo.assets[patternKeyInfo.assets.length-1]) {
						sectionIndex++;
					}
				}
			} else {
				text += getLineText(
					getStartLine(2, parent1stSectionIndex, parent2ndSectionIndex, sectionIndex),
					patternKeyInfo.name
				);
			}
		} else {
			text += getLineText(
				getStartLine(2, parent1stSectionIndex, parent2ndSectionIndex, sectionIndex),
				section.name
			);
		}

		sectionIndex++;
	}

	return text;
}

// 2nd Level - Method used to go through each 2nd level of sectionAssets
function goThrough2ndLevelSections(
			sectionAssets, 
			parentSectionIndex
		) {
	let sectionIndex = 0;
	// Store text that will be returned from this method!
	let text = '';

	// Go through each SectionAsset
	for(const section of sectionAssets ) {
		// If Asset Section does not have a name, it should not be visible at SectionIndex
		if(section.name !== undefined && section.name !== ''){
			if(env === envType.production && section.inDevelopment === true) {
				continue;
			}

			text += getLineText(
				getStartLine(1, parentSectionIndex, sectionIndex),
				section.name
			);

			// Check if section also has subSections (eg: patterns)
			if(section.assets !== undefined) {			
				text += goThrough3ndLevelSections(section.assets, parentSectionIndex, sectionIndex);
			}
			sectionIndex++;
		}
	}
	
	return text;
}

// Method that will create the text for the SectionIndex section dynamically
function createIndexSection() {
	let sectionIndex = 0;
	
	// Start Index Section
	indexSection += ``;
	indexSection += `/*!\n`;
	indexSection += `* ${project.info.name} ${project.info.version}\n`;
	if(project.info.description !== '') {
		indexSection += `* ${project.info.description}\n`;
	}
	indexSection += `* ${project.info.url}\n`;
	indexSection += `*\n`;
	indexSection += `* Section Index\n`;
	
	// 1st Level - Go through all the sections
	for(const section in scssStructure.structure ) {
		const sectionInfo = scssStructure.structure[section];
		// Check if the given section should be added to the SectionIndex
		if(sectionInfo.addToSectionIndex) {
			indexSection += getLineText(
				getStartLine(0, sectionIndex),
				sectionInfo.name
			);

			// Check if the section has no subSections
			if(sectionInfo.assets !== undefined) {
				sectionAssetsInteractor = 1;
				
				// 2nd Level - Go through each SectionAsset
				indexSection += goThrough2ndLevelSections(sectionInfo.assets, sectionIndex);
			}		
			
			sectionIndex++;
		}
	}
	
	indexSection += `*/\n`;
	return indexSection;
}


// Expose the IndexSection Text
exports.devStructure = createIndexSection();