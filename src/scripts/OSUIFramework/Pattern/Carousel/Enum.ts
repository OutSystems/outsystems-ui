// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel.Enum {
	/**
	 * Carousel Events
	 */
	export enum CarouselEvents {
		OnInitialize = 'OnInitialize',
		OnSlideMoved = 'OnSlideMoved',
	}

	/**
	 * Carousel CSS Variables
	 */
	export enum CssVariables {
		CarouselWidth = '--osui-carousel-track-width',
	}

	/**
	 * Carousel CSS Classes
	 */
	export enum CssClass {
		CarouselWrapper = 'osui-carousel',
		Content = 'osui-carousel_content',
		Track = 'osui-carousel_track',
	}

	/**
	 * Carousel Enum for Properties
	 */
	export enum Properties {
		Navigation = 'navigation',
		ItemsDesktop = 'itemsDesktop',
		ItemsTablet = 'itemsTablet',
		ItemsPhone = 'itemsPhone',
		AutoPlay = 'autoplay',
		Loop = 'loop',
		Padding = 'padding',
		Gap = 'gap',
		InitialPosition = 'initialPosition',
		Focus = 'focus',
	}

	/**
	 * Carousel Enum for Providers
	 */
	export enum Provider {
		Splide = 'Splide',
	}
}
