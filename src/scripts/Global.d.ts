import TargetElement from '@nouislider/nouislider';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		NoUiSlider: typeof TargetElement.noUiSlider;
	}

	interface Navigator {
		standalone: any;
	}

	type NoUiSlider = TargetElement;
}
