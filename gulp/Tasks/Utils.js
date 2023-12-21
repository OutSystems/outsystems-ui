// Method that will return a piece of text between a given initial and end pieces of text
exports.getTextToBeReplaced = (text, startOf, endWith, keepStartAndEnd) => {
    const startIndex = text.indexOf(startOf) + (keepStartAndEnd ? 0 : startOf.length);
	const endIndex = startIndex + (text.substring(startIndex, text.length).indexOf(endWith)) + (keepStartAndEnd ? endWith.length : 0);
	const textBetween = text.substring(startIndex, endIndex);
    return textBetween;
}