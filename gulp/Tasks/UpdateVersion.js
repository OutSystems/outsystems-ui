const prompts = require('prompts');
const fs = require('fs');

// Get the default specs
const defaultSpecs = require("./../ProjectSpecs/DefaultSpecs");

// Store the new version
let newVersionToBeSet = '';

// List of files path to be updated
let filesList = {
	classicThemeO11: './classic-theme/O11.OutSystemsUI.css',
	classicThemeODC: './classic-theme/ODC.OutSystemsUI.css',
	classicThemeReadme: './classic-theme/README.md',
	constants: './src/scripts/OSFramework/OSUI/Constants.ts',
	package: './package.json',
	readme: './README.md',
	specs: './gulp/ProjectSpecs/DefaultSpecs.js',
}

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
			newVersionToBeSet = answer.newVersion.replace("v", "");
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
	for(const path in filesList) {
		// Find for text
		let findFor = '';
		let replaceTo = '';


		switch (filesList[path]) {
			// Both bundles share the same banner prefix, only the platform suffix differs
			case filesList.classicThemeO11:
			case filesList.classicThemeODC:
				findFor = `OutSystems UI ${defaultSpecs.info.version}`
				replaceTo = `OutSystems UI ${newVersionToBeSet}`
				break;

			case filesList.constants:
				findFor = `OSUIVersion = '${defaultSpecs.info.version}';`
				replaceTo = `OSUIVersion = '${newVersionToBeSet}';`
				break;

			case filesList.package:
			case filesList.specs:
				findFor = `"version": "${defaultSpecs.info.version}",`
				replaceTo = `"version": "${newVersionToBeSet}",`
				break;
			
			case filesList.classicThemeReadme:
			case filesList.readme:
				findFor = `# OutSystems UI · v${defaultSpecs.info.version}`;
				replaceTo = `# OutSystems UI · v${newVersionToBeSet}`;
				break;
		}

		// Read file code
		let code = fs.readFileSync(filesList[path], 'utf8');

		// Skip the file when there is nothing to look for, or when the expected version is not there
		if (findFor === '' || code.includes(findFor) === false) {
			console.warn(`\n ⚠️  Skipped '${filesList[path]}': couldn't find "${findFor}"! \n`);
			continue;
		}

		// Update code
		let updatedCode = code.replace(findFor, replaceTo);
		// Update the existing file info with the new one!
		fs.writeFileSync(filesList[path], updatedCode, 'utf8');
	}

	cb();
}

// Set the new version script triggered by the GitHub Action, where the new verion will be passed by script variable --newVersion
function gtaSetNewVersion(cb) {	
	// Check if version exist 
	if(process.env.npm_config_newversion === undefined) {
		console.log(`\n⛔️ ERROR: --newVersion is missing at the script!\n`);
		return;
	}
	// Store the version to be set
	newVersionToBeSet = process.env.npm_config_newversion.replace("v", "");
	getFilesList(cb);
}

exports.setVersion = askForNewVersion;
exports.gtaSetVersion = gtaSetNewVersion;