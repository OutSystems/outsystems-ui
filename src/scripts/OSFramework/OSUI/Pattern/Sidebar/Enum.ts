// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar.Enum {
	/**
	 * Sidebar Enum properties
	 */
	export enum Properties {
		StartsOpen = 'StartsOpen',
		Direction = 'Direction',
		Width = 'Width',
		HasOverlay = 'HasOverlay',
	}

	/**
	 * Sidebar default properties
	 */
	export enum Defaults {
		Width = '500px',
	}

	/**
	 * Sidebar Enum for CSS Classes
	 */
	export enum CssClass {
		Aside = 'osui-sidebar',
		Content = 'osui-sidebar__content',
		ClassModifier = 'osui-sidebar--is-',
		HasOverlay = 'osui-sidebar--has-overlay',
		Header = 'osui-sidebar__header',
		IsOpen = 'osui-sidebar--is-open',
		Overlay = 'osui-sidebar__overlay',
	}

	/**
	 * Sidebar Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		Width = '--sidebar-width',
	}

	/**
	 * Sidebar Enum Events
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}
}
