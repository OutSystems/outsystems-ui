import noUiSlider from 'nouislider';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		NoUiSlider: typeof noUiSlider;
	}

	interface Navigator {
		standalone: any;
	}

	type NoUiSlider = noUiSlider;
}
