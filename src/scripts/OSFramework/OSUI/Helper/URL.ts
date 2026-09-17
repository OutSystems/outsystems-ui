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

		/**
		 * Function that validates if a given URL is a valid URL (optional http/https protocol,
		 * domain name or IPv4 address, optional port, path, query string and fragment).
		 *
		 * The domain-name segment is deliberately written without nested quantifiers so the
		 * regex runs in linear time on any input (ReDoS fix, ROU-13054).
		 *
		 * @deprecated This helper has no callers inside OutSystems UI and will be removed in a
		 * future major version. Prefer the native URL constructor (new URL(url) in a try/catch).
		 * @static
		 * @param {string} url
		 * @return {*}  {boolean}
		 * @memberof OSFramework.Helper.URL
		 */
		public static IsValid(url: string): boolean {
			// Segments, in order: optional protocol | domain name OR ip (v4) address | optional port and path |
			// optional query string | optional fragment.
			// Domain name: each label starts and ends alphanumeric, hyphens allowed in between. It is written as
			// [a-z\d](?:[a-z\d-]*[a-z\d])? instead of the previous [a-z\d]([a-z\d-]*[a-z\d])* - same accepted
			// strings, but the nested quantifier backtracked exponentially on non-matching input (ReDoS, ROU-13054).
			// Kept as a single literal (not new RegExp) so static ReDoS analysers can keep checking the pattern.
			const pattern =
				/^(https?:\/\/)?(([a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i; // NOSONAR (S5843) the complexity is inherent to the URL grammar; the regex is proven linear-time (ROU-13054)

			return pattern.test(url) || pattern.test(window.location.host + url);
		}
	}
}
