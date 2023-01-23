// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.Splide.Enum {
	/**
	 * Splide CSS Classes
	 */
	export enum CssClass {
		SplideWrapper = 'splide',
		SplideTrack = 'splide__track',
		SplideList = 'splide__list',
		SplideSlide = 'splide__slide',
	}

	/**
	 * Splide go API options
	 */
	export enum Go {
		Next = '>',
		Previous = '<',
	}

	/**
	 * Splide Keyboard API options
	 */
	export enum KeyboardOptions {
		Focused = 'focused',
	}

	/**
	 * Splide Events
	 */
	export enum SpliderEvents {
		Mounted = 'mounted',
		Moved = 'moved',
	}

	/**
	 * Splide provider info
	 */
	export enum ProviderInfo {
		Name = 'Splide',
		Version = '4.1.3',
	}

	/**
	 * Splide type API options
	 */
	export enum TypeOptions {
		Loop = 'loop',
		Slide = 'slide',
	}
}
