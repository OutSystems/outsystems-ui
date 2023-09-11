// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu.Enum {
	/**
	 * OverflowMenu Enum AriaLabel
	 */
	export enum AriaLabel {
		Trigger = 'Trigger the balloon',
	}

	/**
	 * OverflowMenu Enum CSSClasses
	 */
	export enum CssClass {
		Open = 'osui-overflow-menu--is-open',
		Trigger = 'osui-overflow-menu__trigger',
		Balloon = 'osui-overflow-menu__balloon',
	}

	/**
	 * Balloon Enum CSS Variables
	 */
	export enum CssCustomProperties {
		Shape = '--osui-overflow-menu-shape',
	}

	/**
	 * OverflowMenu Enum events
	 */
	export enum Events {
		OnMenuToggle = 'OnToggle',
	}

	/**
	 * OverflowMenu Enum properties
	 */
	export enum Properties {
		Position = 'Position',
		Shape = 'Shape',
	}
}
