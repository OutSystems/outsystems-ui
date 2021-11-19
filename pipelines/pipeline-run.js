const azdev = require('azure-devops-node-api');
const commandLineArgs = require('command-line-args');
const postErrorMessage = require('./azure_logging').postErrorMessage;
const failtask = require('./azure_logging').failtask;

const outSystemsUIProjectId = '8121bc01-f7eb-4048-9d11-a5141ebc74ce';
const funcationlTestsPipelineId = 1535;
const PIPELINE_FAILED_RESULT = 8;

const optionDefinitions = [
    { name: 'tags', alias: 'c', type: String },
    { name: 'branch', alias: 'b', type: String },
]

const commandLineOptions = commandLineArgs(optionDefinitions, { partial: true });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executePipeline(azureProject, pipelineId) {
    const branch = commandLineOptions.branch?.startsWith('ROU') ? commandLineOptions.branch.replace('-', '') : 'master';
    if (!commandLineOptions.tags) {
        console.log(`Tags not specified. No tests to run.`);
        return;
    }
    const orgUrl = 'https://dev.azure.com/OutSystemsRD';
    const authHandler = azdev.getPersonalAccessTokenHandler(process.env.AZURE_PERSONAL_ACCESS_TOKEN);
    const connection = new azdev.WebApi(orgUrl, authHandler);
    const buildApi = await connection.getBuildApi();
    const testApi = await connection.getTestApi();
    const build = {
        templateParameters: {
            "ENVIRONMENT": 'dev',
            "TAGS": `${commandLineOptions.tags}`,
            "LEGACY": true,
            "BRANCH": branch,
        },
    };
    const url = `${orgUrl}/${azureProject}/_apis/pipelines/${pipelineId}/runs`;
    const reqOpts = {
        acceptHeader: 'application/json;api-version=6.0-preview.1',
    };
    const queuedBuild = await buildApi.rest.create(url, build, reqOpts);
    const id = queuedBuild.result.id;
    let triggeredBuild = await buildApi.getBuild(azureProject, id);
    console.log(`Tests execution for ${triggeredBuild.buildNumber} has started`);
    while (!triggeredBuild.finishTime) {
        await sleep(30000);
        triggeredBuild = await buildApi.getBuild(azureProject, id);
        console.log(`Pipeline execution in progress... ${triggeredBuild._links.web.href}`)
    }
    triggeredBuild = await buildApi.getBuild(azureProject, id);
    console.log(`Tests finished: ${triggeredBuild.result == PIPELINE_FAILED_RESULT ? 'failed' : 'passed'}`);
    const buildResults = await testApi.getTestResultsByBuild(azureProject, id);
    let runResults = [];
    const promises = buildResults.map(async (buildResult) => { runResults.push(...(await testApi.getTestResults(azureProject, buildResult.runId))) });
    await Promise.all(promises);
    const failedWithBugs = (runResults.filter((test) => test.outcome != "Passed" && !test.stackTrace?.includes('**Unstable**'))).map((test) => `${test.testCase.name}`);
    const failedWithoutBugs = (runResults.filter((test) => test.outcome != "Passed" && test.stackTrace?.includes('**Unstable**'))).map((test) => `${test.testCase.name}`);
    console.log(`Failed tests with bugs: \n${failedWithBugs.join('\n')}\n`);
    console.log(`Failed tests without bugs: \n${failedWithoutBugs.join('\n')}\n`);
    if (failedWithoutBugs.length > 0 || failedWithBugs > 0) {
        postErrorMessage(`Some of the tests failed. See details ${triggeredBuild._links.web.href}`);
        failtask();
    }
}

executePipeline(outSystemsUIProjectId, funcationlTestsPipelineId);