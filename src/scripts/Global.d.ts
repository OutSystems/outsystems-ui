import OriginalSplide from '@splidejs/splide';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		Splide: typeof OriginalSplide;
	}

	interface Navigator {
		standalone: any;
	}

	type Splide = OriginalSplide;
}
