const prompts = require('prompts');
const fs = require('fs');

// Get the default specs
const defaultSpecs = require("./../ProjectSpecs/DefaultSpecs");

// Store the new version
let newVersionToBeSet = '';

// list of files path to be updated
let filesPath = [
	'./gulp/ProjectSpecs/DefaultSpecs.js',
	'./package-lock.json',
	'./package.json',
	'./src/scripts/OSFramework/OSUI/Constants.ts',
]

// Prompt question about the new version to be set
function askForNewVersion(cb) {
	(async () => {
		const answer = await prompts([
			{
				message: 'Set the new version',
				name: "newVersion",
				type: 'text',
				initial: 'v' + defaultSpecs.info.version
			},
			{
				active: 'yes',
				inactive: 'no',
				initial: true,
				message: (prev) => ('Do you confirm the new version will be set is: ' + prev + '?'),
				name: 'confirm',
				type: (prev) => (prev ? 'toggle' : null),
			}
		]);

		if (answer.newVersion && answer.confirm === true) {
			newVersionToBeSet = answer.newVersion;
			getFilesList(cb);
		} else {
			console.warn(`\n ❌ Process has been canceled! \n \n`);
			cb();
		}
	})();
}

// Get the list of file where the version must be updated!
function getFilesList(cb) {	
	// Go through all files to be updated!
	for(const path of filesPath) {
		// Read file code
		let code = fs.readFileSync(path, 'utf8');
		// Update code
		let updatedCode = code.replaceAll(defaultSpecs.info.version, newVersionToBeSet.replace("v", ""));
		// Update the existing file info with the new one!
		fs.writeFileSync(path, updatedCode, 'utf8');
	}
	cb();
}

exports.setVersion = askForNewVersion;