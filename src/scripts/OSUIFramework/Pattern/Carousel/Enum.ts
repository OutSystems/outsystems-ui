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
		Content = 'osui-carousel__content',
		Track = 'osui-carousel__track',
	}

	/**
	 * Carousel Enum for Properties
	 */
	export enum Properties {
		Navigation = 'Navigation',
		ItemsDesktop = 'ItemsDesktop',
		ItemsTablet = 'ItemsTablet',
		ItemsPhone = 'ItemsPhone',
		AutoPlay = 'AutoPlay',
		Loop = 'Loop',
		Padding = 'Padding',
		ItemsGap = 'ItemsGap',
		StartingPosition = 'StartingPosition',
	}

	/**
	 * Carousel Enum for Providers
	 */
	export enum Provider {
		Splide = 'Splide',
	}

	/**
	 * Carousel Navigation options
	 */
	export enum Navigation {
		None = 'none',
		Arrows = 'arrows',
		Dots = 'dots',
		Both = 'both',
	}
}
