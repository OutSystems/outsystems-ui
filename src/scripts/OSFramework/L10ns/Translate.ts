// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.L10ns {
	/**
	 *
	 * @param text The text will be translated
	 * @param lang The expected language that given text must be translated
	 * @returns
	 */
	export function Translate(text: string, lang: string): string {
		// Convert given text into PamelCase style
		const wordToBeTranslated = text
			.replace(/\w+/g, (txt) => {
				// Uppercase first letter of each word
				return txt.charAt(0).toUpperCase() + txt.substring(1);
			})
			.replace(/\s/g, ''); // Remove all the white spaces

		// Check if the given text exist at the translatable words list
		if (L10ns[wordToBeTranslated] === undefined || L10ns[wordToBeTranslated][lang] === undefined) {
			return `Can't translate '${text}' into '${lang}'! Check if that word exist at the translatable words collection.`;
		}

		return L10ns.Today[wordToBeTranslated][lang];
	}
}
