import OriginalSplide from '@splidejs/splide';

declare global {
	//eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		Splide: typeof OriginalSplide;
	}
	type Splide = OriginalSplide;
}
