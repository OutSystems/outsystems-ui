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
		ScaleOption = 'has-scale',
	}

	/**
	 * Splide Events
	 */
	export enum SpliderEvents {
		Mounted = 'mounted',
		Moved = 'moved',
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

	export enum FocusOnItem {
		Center = 'center',
		FirstOnSlide = 'first',
		LastOnSlide = 'last',
	}

	export enum FocusOptions {
		Loop = 'loop',
		Slide = 'slide',
	}
}
