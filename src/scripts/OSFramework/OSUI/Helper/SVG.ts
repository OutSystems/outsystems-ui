// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class SVG {
		/**
		 * Function that validates if a given svgString is a valid SVG
		 *
		 * @param url
		 * @memberof OSFramework.Helper.URL
		 */
		public static IsValid(svgString: string): boolean {
			const parser = new DOMParser();
			try {
				const doc = parser.parseFromString(svgString, 'image/svg+xml');
				const parserError = doc.getElementsByTagName('parsererror'); // If there are parser errors or the root element is not <svg>, it's an invalid SVG
				if (parserError.length > 0 || doc.documentElement.tagName !== 'svg') {
					return false;
				}
			} catch (error) {
				return false;
			}
			return true;
		}
	}
}
