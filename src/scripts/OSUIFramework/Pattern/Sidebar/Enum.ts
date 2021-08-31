// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar.Enum {
	/**
	 * Sidebar Enum properties
	 */
	export enum Properties {
		IsOpen = 'IsOpen',
		Direction = 'Direction',
		Width = 'Width',
		HasOverlay = 'HasOverlay',
	}

	/**
	 * Sidebar Enum for CSS Classes
	 */

	export enum CssClass {
		Aside = 'osui-sidebar_aside',
		Content = 'osui-sidebar_content',
		Direction = 'is-',
		HasOverlay = 'has-overlay',
		Header = 'osui-sidebar_header',
		IsOpen = 'is-open',
		Overlay = 'osui-sidebar_overlay',
	}

	/**
	 * Sidebar Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		Width = '--sidebar-width',
	}
}
