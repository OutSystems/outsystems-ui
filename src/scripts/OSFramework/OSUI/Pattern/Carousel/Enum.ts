// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Carousel.Enum {
	/**
	 * Carousel Events
	 */
	export enum CarouselEvents {
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
		HasPagination = 'osui-carousel--has-pagination',
		Track = 'osui-carousel__track',
	}

	/**
	 * Carousel Direction options
	 */
	export enum Direction {
		None = '',
		LeftToRight = 'LeftToRight',
		RightToLeft = 'RightToLeft',
	}

	/**
	 * Carousel Enum for Properties
	 */
	export enum Properties {
		AutoPlay = 'AutoPlay',
		Height = 'Height',
		ItemsDesktop = 'ItemsDesktop',
		ItemsGap = 'ItemsGap',
		ItemsPhone = 'ItemsPhone',
		ItemsTablet = 'ItemsTablet',
		Loop = 'Loop',
		Navigation = 'Navigation',
		Padding = 'Padding',
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
		Arrows = 'arrows',
		Both = 'both',
		Dots = 'dots',
		None = 'none',
	}

	/**
	 * Carousel default properties
	 */
	export enum Defaults {
		Height = 'auto',
		SpaceNone = '0px',
	}
}
