import noUiSlider from 'nouislider';
import Options from 'nouislider';
import { PipsMode } from 'nouislider';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		noUiSlider: typeof noUiSlider;
		NoUiSliderOptions: typeof Options;
		NoUiSliderPipsMode: typeof PipsMode;
	}

	interface Navigator {
		standalone: any;
	}

	type NoUiSlider = noUiSlider;
	type NoUiSliderOptions = Options;
	type NoUiSliderPipsMode = PipsMode;
}
