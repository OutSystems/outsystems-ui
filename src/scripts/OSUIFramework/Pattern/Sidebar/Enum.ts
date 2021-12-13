// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar.Enum {
	/**
	 * Sidebar Enum properties
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Properties {
		StartsOpen = 'StartsOpen',
		Direction = 'Direction',
		Width = 'Width',
		HasOverlay = 'HasOverlay',
	}

	/**
	 * Sidebar Enum for CSS Classes
	 *
	 * @export
	 * @enum {number}
	 */
	export enum CssClass {
		Aside = 'osui-sidebar__aside',
		Content = 'osui-sidebar__aside__content',
		ClassModifier = 'osui-sidebar--is-',
		HasOverlay = 'osui-sidebar--has-overlay',
		Header = 'osui-sidebar__aside__header',
		IsOpen = 'osui-sidebar--is-open',
		Overlay = 'osui-sidebar__overlay',
	}

	/**
	 * Sidebar Enum for CSS Custom Properties
	 *
	 * @export
	 * @enum {number}
	 */
	export enum CssProperty {
		Width = '--sidebar-width',
	}
}
