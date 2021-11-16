const { exec } = require('child_process');

function messageFunction(err, stdout, stderr) {
    if (err) {
        console.info(err);
    } else {
        console.info(`${stdout}${stderr}`);
    }
}

function postErrorMessage(message) {
    exec(`echo "##vso[task.logissue type=error]${message.replace(/"/g, "\\\"")}"`, messageFunction);
}

function postWarningMessage(message) {
    exec(`echo "##vso[task.logissue type=warning]${message.replace(/"/g, "\\\"")}"`, messageFunction);
}

function failtask() {
    exec(`echo "##vso[task.complete result=Failed;]DONE"`,
        (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.info(err);
            } else {
                // the *entire* stdout and stderr (buffered)
                console.info(`${stdout}`);
            }
        });
}

exports.postWarningMessage = postWarningMessage;
exports.postErrorMessage = postErrorMessage;
exports.failtask = failtask;
