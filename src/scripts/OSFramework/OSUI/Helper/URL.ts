// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class URL {
		/**
		 * Function that extracts the file extension from a given URL
		 *
		 * @static
		 * @param {string} url
		 * @return {*}  {(string | null)}
		 * @memberof OSFramework.Helper.URL
		 */
		public static GetFileTypeFromURL(url: string): string | null {
			// Use a regular expression to extract the file extension from the URL
			const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
			return match ? match[1].toLowerCase() : null;
		}

		/**
		 * Function that validates if a given URL is a valid image URL
		 *
		 * @param url
		 * @memberof OSFramework.Helper.URL
		 */
		public static IsImage(url: string): boolean {
			return (
				url.match(
					/(^data:image\/*(jpeg|jpg|gif|png|svg);base64)|\/?(\.\w\.)*\.(jpeg|jpg|gif|png|svg)($|(\?))/i
				) !== null
			);
		}
	}
}
