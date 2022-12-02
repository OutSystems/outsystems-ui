const scssStructure = require('../../ProjectSpecs/ScssStructure/#All');

// Method that will create the text for the SectionIndex section dynamically
function createPartialsList() {		
	// 1st Level - Go through all the sections
	for(const section in scssStructure.structure ) {
		const sectionInfo = scssStructure.structure[section];

		console.log(sectionInfo);
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		
		if(sectionInfo.assets && sectionInfo.assets.length > 0) {
			for(const sectionAsset of sectionInfo.assets) {
				console.log(sectionAsset);	
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
			}
		}
		
		console.log("#####################################################");
		
	}
	
	return '';
}


// Expose the IndexSection Text
exports.text = createPartialsList();