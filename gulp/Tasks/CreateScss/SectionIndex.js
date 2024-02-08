const project = require('../../ProjectSpecs/DefaultSpecs');
const patterns = require('../../ProjectSpecs/Patterns/#All');
const scssStructure = require('../../ProjectSpecs/ScssStructure/#All');

// Store text that will be added as SectionIndex
let indexSection;

function createIndexSectionDev(platformType) {
    indexSection = '';
    return createIndexSection(project.globalConsts.envType.development, platformType);
}

function createIndexSectionProd(platformType) {
    indexSection = '';
    return createIndexSection(project.globalConsts.envType.production, platformType);
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
function createIndexSection(env, platformType) {
	// Section iteractor
    let sectionIndex = 0;

    // Start Index Section
    indexSection += ``;
    indexSection += `/*!\n`;
    indexSection += `${project.info.name} ${project.info.version} • ${platformType} Platform\n`;
    if (project.info.description !== '') {
        indexSection += `${project.info.description}\n`;
    }
    indexSection += `${project.info.url}\n`;
    indexSection += `${project.info.gitHub}\n`;
    indexSection += `*/ \n`;
    indexSection += `/*!\n`;
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
                    if(asset.platform !== undefined && asset.platform !== platformType) {
                        continue;
                    } 
                    // Check if Asset is also present at the SectionIndex
                    else if (sectionInfo.addToSectionIndex && sectionInfo.assets.length > 1 && asset.name !== '') {
                        // Create a asset SubComment
                        indexSection += getLineText(`${sectionIndex}.${assetIndex}. ${asset.name}`, 1);
                    }

                    // Check if the current Asset also contains it's own Assets (Ex: Patterns case)
                    if (asset.assets && asset.assets.length > 0) {
                        // SubAsset iteractor
                        let subAssetIndex = 1;

                        // 2. Go through each section assets
                        for (const subAsset of asset.assets) {
                            if(subAsset.platform !== undefined && subAsset.platform !== platformType) {
                                continue;
                            }
                            // Check if 'key' is an attribute of the current asset, if so it means it's a pattern!
                            else if (subAsset.key === undefined) {
                                indexSection += getLineText(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${subAsset.name}`, 2);
                            } else {

                                // Get the info about the current object key (Pattern)
                                const assetInfo = patterns.all[subAsset.key];

                                if (
                                    env === project.globalConsts.envType.development ||
                                    assetInfo.inDevelopment === undefined | false ||
                                    assetInfo.inDevelopment === false ||
                                    (
                                        env = project.globalConsts.envType.production &&
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
                                                env === project.globalConsts.envType.development || assetItem.inDevelopment === false
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