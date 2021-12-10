// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip.Enum {
	/**
	 * Tooltip Enum properties
	 */
	export enum Properties {
		IsVisible = 'IsVisible',
		IsHover = 'IsHover',
		Position = 'Position',
	}

	/**
	 * Tooltip Enum Css Classes
	 */
	export enum CssClass {
		Pattern = 'osui-tooltip',
		IsHover = 'osui-tooltip--is-hover',
		IsVisible = 'osui-tooltip--is-opened',
		Content = 'osui-tooltip__content',
		BalloonWrapper = 'osui-tooltip__balloon-wrapper',
		BalloonContent = 'osui-tooltip__balloon-wrapper__balloon',
	}

	export enum AriaLabelText {
		Content = 'toggle tooltip',
	}
}
