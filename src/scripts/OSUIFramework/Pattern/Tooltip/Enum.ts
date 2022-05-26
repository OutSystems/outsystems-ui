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
		IsOpened = 'osui-tooltip--is-opened',
		Pattern = 'osui-tooltip',
	}

	/**
	 * Events
	 */
	export enum Events {
		Initialized = 'Initialized',
		OnToggle = 'OnToggle',
	}

	/**
	 * Inline CSS variables!
	 */
	export enum InlineCssVariables {
		Height = '--osui-tooltip-height',
		Left = '--osui-tooltip-left',
		Top = '--osui-tooltip-top',
		Width = '--osui-tooltip-width',
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
