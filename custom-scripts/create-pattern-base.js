var shell = require('shelljs');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

const patternname = process.env.npm_config_patternname;

shell.echo('Lets do this or pattern = ' + patternname);

const scssTemplate = 'custom-scripts/templates/SCSS-Template.scss';
const pattTemplate = 'custom-scripts/templates/Pattern-Template.ts';
const pattConfigTemplate = 'custom-scripts/templates/Config-Template.ts';
const apiTemplate = 'custom-scripts/templates/API-Template.ts';
const interfaceTemplate = 'custom-scripts/templates/Interface-Template.ts';
const enumTemplate = 'custom-scripts/templates/Enum-Template.ts';

const folderPath = 'src/scripts/OSUIFramework/Pattern/' + patternname;
const scssFolderPath = 'src/scripts/OSUIFramework/Pattern/' + patternname + '/scss';
const scssFilePath =
	'src/scripts/OSUIFramework/Pattern/' + patternname + '/scss/_' + patternname.toLowerCase() + '.scss';
const pattFilePath = 'src/scripts/OSUIFramework/Pattern/' + patternname + '/' + patternname + '.ts';
const pattConfigFilePath = 'src/scripts/OSUIFramework/Pattern/' + patternname + '/' + patternname + 'Config.ts';
const enumFilePath = 'src/scripts/OSUIFramework/Pattern/' + patternname + '/Enum.ts';
const interfaceFilePath = 'src/scripts/OSUIFramework/Pattern/' + patternname + '/I' + patternname + '.ts';
const pattAPIFilePath = 'src/scripts/OutSystems/OSUI/Patterns/' + patternname + 'API.ts';

//check if folder exists
if (shell.test('-e', folderPath)) {
	shell.echo('The folder already exists ' + folderPath);
} else {
	shell.mkdir(folderPath);
	shell.echo('Created ' + folderPath);
}

//check if scss folder exists
if (shell.test('-e', scssFolderPath)) {
	shell.echo('The folder already exists ' + scssFolderPath);
} else {
	shell.mkdir(scssFolderPath);
	shell.echo('Created ' + scssFolderPath);
}

//check if scss file exists
if (shell.test('-e', scssFilePath)) {
	shell.echo('The folder already exists ' + scssFilePath);
} else {
	shell.touch(scssFilePath);
	shell.cat(scssTemplate).to(scssFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, scssFilePath);

	shell.echo('Created ' + scssFilePath);
}

//check if interface file exists
if (shell.test('-e', interfaceFilePath)) {
	shell.echo('The folder already exists ' + interfaceFilePath);
} else {
	shell.touch(interfaceFilePath);
	shell.cat(interfaceTemplate).to(interfaceFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, interfaceFilePath);
	shell.echo('Created ' + interfaceFilePath);
}

//check if enum file exists
if (shell.test('-e', enumFilePath)) {
	shell.echo('The folder already exists ' + enumFilePath);
} else {
	shell.touch(enumFilePath);
	shell.cat(enumTemplate).to(enumFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, enumFilePath);
	shell.echo('Created ' + enumFilePath);
}

//check if pattern ts file exists
if (shell.test('-e', pattFilePath)) {
	shell.echo('The folder already exists ' + pattFilePath);
} else {
	shell.touch(pattFilePath);
	shell.cat(pattTemplate).to(pattFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, pattFilePath);
	shell.sed('-i', '<Pattern-Name2>', patternname, pattFilePath);
	shell.sed('-i', '<Pattern-Name3>', patternname, pattFilePath);
	shell.echo('Created ' + pattFilePath);
}

//check if pattern API file exists
if (shell.test('-e', pattAPIFilePath)) {
	shell.echo('The folder already exists ' + pattAPIFilePath);
} else {
	shell.touch(pattAPIFilePath);
	shell.cat(apiTemplate).to(pattAPIFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, pattAPIFilePath);
	shell.echo('Created ' + pattAPIFilePath);
}

//check if pattern config file exists
if (shell.test('-e', pattConfigFilePath)) {
	shell.echo('The folder already exists ' + pattConfigFilePath);
} else {
	shell.touch(pattConfigFilePath);
	shell.cat(pattConfigTemplate).to(pattConfigFilePath);
	shell.sed('-i', '<Pattern-Name>', patternname, pattConfigFilePath);
	shell.echo('Created ' + pattConfigFilePath);
}
