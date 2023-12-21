const bn = require('branch-name');
const fs = require('fs');

const utils = require('./Utils');

// Update .gitignore file in order to remove ./dist folder from being ignored
exports.removeDist = (cb) => {
    // Store the name of the branch where this action can only be performed
    const branchName = 'main';
    // Get the current branch name
    bn.get().then((name) => {
        // Check if the curren branch is the expected one!
        if(name === branchName) {
            let code = fs.readFileSync(`./.gitignore`, 'utf8');            
            // Remove dist folder
            code = code.replace(utils.getTextToBeReplaced(code, '# Distribution files folder', '/**\n', true), '');
            // Update .gitignore file
            fs.writeFileSync(`./.gitignore`, code, 'utf8');
            cb();
        } else {
            console.log(`\n⛔️ ERROR: Current branch is '${name}'. This action is only available if active branch is '${branchName}'.\n`);
        }
    });
}