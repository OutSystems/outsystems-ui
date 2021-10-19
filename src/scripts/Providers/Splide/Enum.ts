// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.Enum {
	/**
	 * Splide CSS Classes
	 */
	export enum CssClass {
		Splide = 'splide',
		SplideTrack = 'splide__track',
		SplideList = 'splide__list',
		SplideSlide = 'splide__slide',
	}

	/**
	 * Splide focus API options
	 */
	export enum FocusOnItem {
		Center = 'center',
		FirstOnSlide = 'first',
		LastOnSlide = 'last',
	}

	/**
	 * Splide type API options
	 */
	export enum TypeOptions {
		Loop = 'loop',
		Slide = 'slide',
	}

	/**
	 * Splide Keyboard API options
	 */
	export enum KeyboardOptions {
		Focused = 'focused',
	}

	/**
	 * Splide Navigation options
	 */
	export enum Navigation {
		None = 'none',
		Arrows = 'arrows',
		Dots = 'dots',
		Both = 'both',
	}

	/**
	 * Splide Events
	 */
	export enum SpliderEvents {
		Mounted = 'mounted',
		Moved = 'moved',
	}
}
