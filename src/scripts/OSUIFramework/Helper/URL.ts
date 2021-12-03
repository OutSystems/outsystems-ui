// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class URL {
		/**
		 * Function that validate if a given URL is an image URL
		 *
		 * @param url
		 * @memberof URL
		 */
		public static IsImage(url: string): boolean {
			let isImageUrl = false;

			// Check if the given URL doesn't have spaces and if it's valid!
			if (url.indexOf(' ') === -1 && this.IsValid(url)) {
				// Get the size that given url should be cropped
				const urlCropSize = url.lastIndexOf('.') + 5; // +5 in order to maintain .jpeg
				// Clean given URL if needed
				let cleanURL = url.substring(0, urlCropSize);

				// Check if the last character it's different fom "g" (jpeg)
				if (cleanURL.length >= urlCropSize && cleanURL[cleanURL.length - 1] !== 'g') {
					// Remove the last character
					cleanURL = url.substring(0, cleanURL.length - 1);
				}

				// Test given URL for the available images
				isImageUrl = cleanURL.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null;
			}

			return isImageUrl;
		}

		/**
		 * Function that validate if a given URL is a valid URL
		 *
		 * @param url
		 * @memberof URL
		 */
		public static IsValid(url: string): boolean {
			let isUrlValid = false;

			const pattern = new RegExp(
				'^(https?:\\/\\/)?' + // protocol
					'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
					'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
					'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
					'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
					'(\\#[-a-z\\d_]*)?$',
				'i'
			); // fragment locator

			// Check if it's an absolute url
			if (pattern.test(url)) {
				isUrlValid = true;
			} else {
				// Check if it's an relative url
				isUrlValid = pattern.test(window.location.host + url);
			}

			return isUrlValid;
		}
	}
}
