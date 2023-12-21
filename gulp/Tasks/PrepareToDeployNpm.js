const gulp = require('gulp');
const branchName = require('branch-name');
const clean = require('gulp-clean');
const fs = require('fs');
const jsonFix = require('json-fixer');

const utils = require('./Utils');

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

// Method that will update package.json file in order to remove unneeded stuff, once guld folder will also be removed
function cleanPackageJsonFile() {
    let code = fs.readFileSync(`./package.json`, 'utf8');
    // Remove scripts section
    code = code.replace(utils.getTextToBeReplaced(code, '"scripts"', '},\n', true), '');
    // Remove engines section
    code = code.replace(utils.getTextToBeReplaced(code, '"engines"', '},\n', true), '');
    // Remove devDependencies section
    code = code.replace(utils.getTextToBeReplaced(code, '"devDependencies"', '}\n', true), '');
    // Update package.json file
    fs.writeFileSync(`./package.json`, JSON.stringify(jsonFix(code).data), 'utf8');
}

// Method that will update README.md file in order to remove uneeded text at the context of NPM package
function cleanReadmeFile() {
    let code = fs.readFileSync(`./README.md`, 'utf8');
    // Remove scripts section
    code = code.replace(utils.getTextToBeReplaced(code, '### How to change this code?', '## Useful Links', false), '');
    // Clean pending text
    code = code.replace('### How to change this code?', '');
    // Update package.json file
    fs.writeFileSync(`./README.md`, code, 'utf8');
}

// Prepare code branch to deply
exports.prepareToDeployNpm = (cb) => {
    // Store the name of the branch to be used to deploy into NPM 
    const prepareToDeployBranchName = 'prep-to-deploy';
    // Get the current branch name
    branchName.get().then((name) => {
        // Check if the curren branch is the expected one!
        if(name === prepareToDeployBranchName) {
            // Update README.md
            cleanReadmeFile();
            // Update package.json
            cleanPackageJsonFile();
            // Go through all the listOfPathFiles in order to remove them!
            for(const fpath of listOfPathFilesToRemove) {
                // Remove current file
                gulp.src(fpath, {read: false}).pipe(clean());
            }
            cb();
        } else {
            console.log(`\n⛔️ ERROR: Current branch is '${name}'. This action is only available if active branch is '${prepareToDeployBranchName}'.\n`);
        }
    });
}