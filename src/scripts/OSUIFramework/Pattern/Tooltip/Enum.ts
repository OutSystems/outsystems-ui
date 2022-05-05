// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip.Enum {
	/**
	 * AriaLabel
	 */
	export enum AriaLabelText {
		Content = 'toggle tooltip',
	}

	/**
	 * Tooltip Enum Css Classes
	 */
	export enum CssClass {
		BalloonContent = 'osui-tooltip__balloon-wrapper__balloon',
		BalloonWrapper = 'osui-tooltip__balloon-wrapper',
		Content = 'osui-tooltip__content',
		IsHover = 'osui-tooltip--is-hover',
		Pattern = 'osui-tooltip',
		StartVisible = 'osui-tooltip--is-opened',
	}

	/**
	 * Events
	 */
	export enum Events {
		Initialized = 'Initialized',
		OnToggle = 'OnToggle',
	}

	/**
	 * Tooltip Enum properties
	 */
	export enum Properties {
		IsHover = 'IsHover',
		Position = 'Position',
		StartVisible = 'StartVisible',
	}
}
