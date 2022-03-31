// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Submenu.Enum {
	/**
	 * Submenu Enum properties
	 */
	export enum Properties {
		OpenOnHover = 'OpenOnHover',
	}

	// Css Classes
	export enum CssClass {
		Pattern = 'osui-submenu',
		PatternActive = 'active' /* This active class is injected by platform and we need to keep it */,
		PatternHeader = 'osui-submenu__header',
		PatternIsDropdown = 'osui-submenu--is-dropdown',
		PatternIsHidden = 'osui-submenu--is-hidden',
		PatternIsOpen = 'osui-submenu--is-open',
		PatternIcon = 'osui-submenu__header__icon',
		PatternItem = 'osui-submenu__header__item',
		PatternLinks = 'osui-submenu__items',
	}
}
