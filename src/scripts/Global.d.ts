import OriginalSplide from '@splidejs/splide';

/**
 * Splide Carousel library definition
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		Splide: typeof OriginalSplide;
	}
	type Splide = OriginalSplide;
}

/**
 * Global cordova type definition
 */
export declare global {
	interface Window {
		cordova: any;
	}
}

/**
 * Global navigator.standalone type definition
 */
export declare global {
	interface Navigator {
		standalone: any;
	}
}
