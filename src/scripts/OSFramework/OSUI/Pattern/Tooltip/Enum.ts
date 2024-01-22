// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tooltip.Enum {
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
		Arrow = 'osui-tooltip__balloon-arrow',
		BalloonContent = 'osui-tooltip__balloon-wrapper__balloon',
		BalloonIsOpened = 'osui-tooltip__balloon-wrapper--is-open',
		BalloonIsOpening = 'osui-tooltip__balloon-wrapper--is-opening',
		BalloonWrapper = 'osui-tooltip__balloon-wrapper',
		Content = 'osui-tooltip__content',
		IsHover = 'osui-tooltip--is-hover',
		IsOpened = 'osui-tooltip--is-open',
		Pattern = 'osui-tooltip',
	}

	/**
	 * Events
	 */
	export enum Events {
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
