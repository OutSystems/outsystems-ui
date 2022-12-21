const project = require('../../ProjectSpecs/DefaultSpecs');
const patterns = require('../../ProjectSpecs/Patterns/#All');
const scssStructure = require('../../ProjectSpecs/ScssStructure/#All');

const envType = {'development':'dev', 'production':'prod'}

// Store text that will be added as SectionIndex
let indexSection = '';

function createIndexSectionDev() {
    return createIndexSection(envType.development);
}

function createIndexSectionProd() {
    return createIndexSection(envType.production);
}

// Used to define the initialization text of each line
function getLineText(text, level = 0) {
	let textLine = '';
	switch (level) {
		case 0:
			textLine += ``;
			break;
		case 1:
			textLine += `    `;
			break;
		case 2:
			textLine += `        `;
			break;
		case 3:
			textLine += `            `;
			break;
	}

	textLine += `${text}\n`;

	return textLine;
}


// Method that will create the text for the SectionIndex section dynamically
function createIndexSection(env) {
	// Section iteractor
    let sectionIndex = 0;

    // Start Index Section
    indexSection += ``;
    indexSection += `/*!\n`;
    indexSection += `${project.info.name} ${project.info.version}\n`;
    if (project.info.description !== '') {
        indexSection += `${project.info.description}\n`;
    }
    indexSection += `${project.info.url}\n`;
    indexSection += `\n`;
    indexSection += `Section Index:\n`;

    // 0. Go through all the Sections
    for (const section in scssStructure.structure) {
        const sectionInfo = scssStructure.structure[section];
        // Check if the given section should be added to the SectionIndex and if the current section has subSections
        if (sectionInfo.addToSectionIndex && sectionInfo.assets !== undefined) {
            indexSection += getLineText(`${sectionIndex}. ${sectionInfo.name}`, 0);

            // Check if the current section contains assets to be included!
            if (sectionInfo.assets && sectionInfo.assets.length > 0) {
                // Asset iteractor
                let assetIndex = 1;

                // 1. Go through each section assets
                for (const asset of sectionInfo.assets) {
                    // Check if Asset is also present at the SectionIndex
                    if (sectionInfo.addToSectionIndex && sectionInfo.assets.length > 1 && asset.name !== '') {
                        // Create a asset SubComment
                        indexSection += getLineText(`${sectionIndex}.${assetIndex}. ${asset.name}`, 1);
                    }

                    // Check if the current Asset also contains it's own Assets (Ex: Patterns case)
                    if (asset.assets && asset.assets.length > 0) {
                        // SubAsset iteractor
                        let subAssetIndex = 1;

                        // 2. Go through each section assets
                        for (const subAsset of asset.assets) {
                            // Check if 'key' is an attribute of the current asset, if so it means it's a pattern!
                            if (subAsset.key === undefined) {
                                indexSection += getLineText(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${subAsset.name}`, 2);
                            } else {

                                // Get the info about the current object key (Pattern)
                                const assetInfo = patterns.all[subAsset.key];

                                if (
                                    env === envType.development ||
                                    assetInfo.inDevelopment === undefined | false ||
                                    assetInfo.inDevelopment === false ||
                                    (
                                        env = envType.production &&
                                        assetInfo.inDevelopment &&
                                        assetInfo.inDevelopment === false
                                    )
                                ) {
                                    // Common asset info
                                    if (assetInfo.name) {
                                        indexSection += getLineText(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${assetInfo.name}`, 2);
                                    } else if (assetInfo.codeName) { // In case it's a Group!
                                        indexSection += getLineText(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${assetInfo.codeName}`, 2);
                                    }

                                    // Check if the current asset is a group (Ex: DatePicker case)
                                    if (assetInfo.assets && assetInfo.assets.length > 0) {
                                        // AssetItem iteractor
                                        let assetInfoItemIndex = 1;

                                        // 3. Go through each asset
                                        for (const assetItem of assetInfo.assets) {

                                            if (
                                                env === envType.development || assetItem.inDevelopment === false
                                            ) {
                                                if (assetItem.scss) {
                                                    indexSection += getLineText(`${sectionIndex}.${assetIndex}.${subAssetIndex}.${assetInfoItemIndex} ${assetItem.name}`, 3);

                                                    // Increase AssetItem iteractor
                                                    assetInfoItemIndex++;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Increase Asset iteractor
                            subAssetIndex++;
                        }
                    }

                    // Increase asset iteractor
                    assetIndex++;
                }
            }

            // Increase section iteractor
            sectionIndex++;
        }
    }

    indexSection += `*/\n`;
    return indexSection;
}


// Expose the IndexSection Text
exports.textDev = createIndexSectionDev;
exports.textProd = createIndexSectionProd;