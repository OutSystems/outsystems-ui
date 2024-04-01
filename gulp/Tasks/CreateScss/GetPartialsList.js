const patterns = require('../../ProjectSpecs/Patterns/#All');
const project = require('../../ProjectSpecs/DefaultSpecs');
const scssStructure = require('../../ProjectSpecs/ScssStructure/#All');

// Store the text to be exposed!
let partialsListText;

function createPartialsListDev(platformType) {
    partialsListText = '';
    return createPartialsList(project.globalConsts.envType.development, platformType);
}

function createPartialsListProd(platformType) {
    partialsListText = '';
    return createPartialsList(project.globalConsts.envType.production, platformType);
}

// Method used to create the import text
function getImportLineText(text) {
	return `@import '${text}';\n`;
}

// Method used to create the section title of each section!
function createSectionCommentTitle(text, type) {
	let sectionTitle = '';
	
	switch (type) {
		case 0: // Block Section
			sectionTitle = 	"/*! ==============================================================================\n";
			sectionTitle += `${text}\n`;
			sectionTitle +=	"=============================================================================== */\n";
			break;
		
		case 1: // Block Section to be ignored at the compiled css
			sectionTitle = 	"/* ===============================================================================\n";
			sectionTitle += `${text}\n`;
			sectionTitle +=	"=============================================================================== */\n";
			break;
		
		case 2: // Inline to be present at the compuliled css
			sectionTitle = `/*! ${text} */\n`;
			break;

		default: // Inline to be removed at compiled css
			sectionTitle = `// ${text} \n`;	
	}

	return sectionTitle;
}

// Method that will create the text for the SectionIndex section dynamically
function createPartialsList(env, platformType) {	
    // Section iteractor
    let sectionIndex = 0;

    // 0. Go through all the Sections
    for (const section in scssStructure.structure) {
        const sectionInfo = scssStructure.structure[section];

        // Create Block comment
        if (sectionInfo.addToSectionIndex) {
            partialsListText += createSectionCommentTitle(`${sectionIndex}. ${sectionInfo.name}`, 0);
        } else {
            partialsListText += createSectionCommentTitle(`${sectionInfo.name}`, 1);
        }

        // Check if the current section contains assets to be included!
        if (sectionInfo.assets && sectionInfo.assets.length > 0) {
            // Asset iteractor
            let assetIndex = 1;

            // 1. Go through each section assets
            for (const asset of sectionInfo.assets) {
                if(asset.platform !== undefined && asset.platform !== platformType) {
                    continue
                } else {
                    // Check if Asset is also present at the SectionIndex
                    if (sectionInfo.addToSectionIndex && sectionInfo.assets.length > 1 && asset.name !== '') {
                        // Create a asset SubComment
                        partialsListText += createSectionCommentTitle(`${sectionIndex}.${assetIndex}. ${asset.name}`, 2);
                    }

                    // Check if the current asset do not have other assets assigned (Patterns case)
                    if (asset.path !== undefined) {
                        partialsListText += getImportLineText(asset.path);
                    }
                }

                // Check if the current Asset also contains it's own Assets (Ex: Patterns case)
                if (asset.assets && asset.assets.length > 0) {
                    // SubAsset iteractor
                    let subAssetIndex = 1;

                    // 2. Go through each section assets
                    for (const subAsset of asset.assets) {
                        if(subAsset.platform !== undefined && subAsset.platform !== platformType) {
                            continue;
                        } else if (subAsset.key === undefined) {
                            partialsListText += createSectionCommentTitle(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${subAsset.name}`, 2);

                            partialsListText += getImportLineText(subAsset.path);
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
                                    partialsListText += createSectionCommentTitle(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${assetInfo.name}`, 2);
                                } else if (assetInfo.codeName) { // In case it's a Group!
                                    partialsListText += createSectionCommentTitle(`${sectionIndex}.${assetIndex}.${subAssetIndex}. ${assetInfo.codeName}`, 2);
                                }

                                if (assetInfo.scss) {
                                    partialsListText += getImportLineText(assetInfo.scss);
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
                                                partialsListText += createSectionCommentTitle(`${sectionIndex}.${assetIndex}.${subAssetIndex}.${assetInfoItemIndex} ${assetItem.name}`, 2);

                                                partialsListText += getImportLineText(assetItem.scss);

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

                    if (assetIndex < sectionInfo.assets.length - 1) {
                        partialsListText += "\n";
                    }
                }

                // Increase asset iteractor
                assetIndex++;
            }
        }

        partialsListText += "\n";

        // Increase section iteractor!
        if (sectionInfo.addToSectionIndex) {
            sectionIndex++;
        }
    }

    return partialsListText;
}


// Expose the IndexSection Text
exports.textDev = createPartialsListDev;
exports.textProd = createPartialsListProd;