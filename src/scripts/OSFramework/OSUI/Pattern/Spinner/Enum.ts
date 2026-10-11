// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Spinner.Enum {
	/**
	 * Spinner animation types. Values must match the Service Studio static entity identifiers.
	 * The glyph markup for each type lives in the block; the pattern only applies the matching modifier class.
	 *
	 * @export
	 * @enum {string}
	 */
	export enum AnimationType {
		Bubbles = 'bubbles',
		Circle = 'circle',
		Circular = 'circular',
		Crescent = 'crescent',
		Default = 'default',
		Dots = 'dots',
		Lines = 'lines',
		LinesSharp = 'lines-sharp',
	}

	/**
	 * Spinner css classes
	 *
	 * @export
	 * @enum {string}
	 */
	export enum CssClass {
		ModifierPrefix = 'osui-spinner--',
		Pattern = 'osui-spinner',
	}

	/**
	 * Spinner css variables set inline
	 *
	 * @export
	 * @enum {string}
	 */
	export enum CssProperty {
		Color = '--osui-spinner-color',
	}

	/**
	 * Spinner configurable properties
	 *
	 * @export
	 * @enum {string}
	 */
	export enum Properties {
		AnimationType = 'AnimationType',
		Color = 'Color',
		Size = 'Size',
	}

	/**
	 * Spinner sizes. Values must match the Service Studio static entity identifiers.
	 *
	 * @export
	 * @enum {string}
	 */
	export enum Size {
		ExtraLarge = 'xlarge',
		Large = 'large',
		Medium = 'medium',
		Small = 'small',
		Xsmall = 'xsmall',
	}
}
