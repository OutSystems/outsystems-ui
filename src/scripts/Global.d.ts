import OriginalSplide from '@splidejs/splide';
import { SplideOptions } from '@splidejs/splide';

/**
 * Set global declarations
 */

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		cordova: any;
		Splide: typeof OriginalSplide;
		SplideOpts: typeof SplideOptions;
	}

	interface Navigator {
		standalone: any;
	}

	type Splide = OriginalSplide;
	type SplideOpts = SplideOptions;
}
