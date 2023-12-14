const branchName = require('branch-name');
const fs = require('fs');
const jsonFix = require('json-fixer');

// Store the list of files that should be removed before deploy to NPM
const listOfPathFilesToRemove = [
    './.github',
    './.vscode',
    './gulp',
    './pipelines',
    './.eslintignore',
    './.eslintrc.json',
    './.gitignore',
    './.prettierignore',
    './.prettierrc.json',
    './.snyk',
    './.stylelintignore',
    './.stylelintrc.json',
    './CODEOWNERS',
    './gulpfile.js',
    './tsconfig.json',
    './typedoc.json',
];

// Method that will update package.json file in order to remove unneeded stuff, once guld folder will also be removed!
function cleanPackageJsonFile() {
    let code = fs.readFileSync(`./package.json`, 'utf8');
    // Remove scripts section
    code = code.replace(getTextToBeReplaced(code, '"scripts"', '},\n', true), '');
    // Remove engines section
    code = code.replace(getTextToBeReplaced(code, '"engines"', '},\n', true), '');
    // Remove devDependencies section
    code = code.replace(getTextToBeReplaced(code, '"devDependencies"', '}\n', true), '');
    // Update package.json file
    fs.writeFileSync(`./package.json`, JSON.stringify(jsonFix(code).data), 'utf8');
}

// Method that will return a piece of text between a given initial and end pieces of text
function getTextToBeReplaced(code, startOf, endWith, keepStartAndEnd) {
    const startIndex = code.indexOf(startOf) + (keepStartAndEnd ? 0 : startOf.length);
	const endIndex = startIndex + (code.substring(startIndex, code.length).indexOf(endWith)) + (keepStartAndEnd ? endWith.length : 0);
	const textBetween = code.substring(startIndex, endIndex);
    return textBetween;
}

// Prepare code branch to deply
exports.prepareToDeployNpm = (cb) => {
    // Store the name of the branch to be used to deploy into NPM
    /* TODO: Update const value into: prep-to-deploy */
    const prepareToDeployBranchName = 'prep-to-deploy';

    // Get the current branch name
    branchName.get().then((name) => {
        // Check if the curren branch is the expected one!
        if(name === prepareToDeployBranchName) {
            // Update package.json
            cleanPackageJsonFile();

            // Go through all the listOfPathFiles in order to remove them!
            for(const fpath of listOfPathFilesToRemove) {
                // Remove current file
                gulp.src(fpath, {read: false}).pipe(clean());
            }
            cb();
        } else {
            console.log(`\n⛔️ ERROR: Current branch is '${name}'. This action is only available for branch '${prepareToDeployBranchName}'.\n`);
        }
    });
}