// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Carousel/Enum.ts
namespace OSFramework.Patterns.Carousel.Enum {
========
namespace OSFramework.OSUI.Patterns.Carousel.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Carousel/Enum.ts
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
}
