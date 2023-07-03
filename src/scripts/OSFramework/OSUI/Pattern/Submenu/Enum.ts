// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Submenu/Enum.ts
namespace OSFramework.Patterns.Submenu.Enum {
========
namespace OSFramework.OSUI.Patterns.Submenu.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Submenu/Enum.ts
	/**
	 *  Css Classes
	 */
	export enum CssClass {
		Pattern = 'osui-submenu',
		PatternActive = 'active' /* This active class is injected by platform and we need to keep it */,
		PatternHeader = 'osui-submenu__header',
		PatternIsDropdown = 'osui-submenu--is-dropdown',
		PatternIsHidden = 'osui-submenu--is-hidden',
		PatternIsHover = 'osui-submenu--is-hover',
		PatternIsOpen = 'osui-submenu--is-open',
		PatternIcon = 'osui-submenu__header__icon',
		PatternItem = 'osui-submenu__header__item',
		PatternLinks = 'osui-submenu__items',
	}

	/**
	 * Events
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}

	/**
	 * Submenu Enum properties
	 */
	export enum Properties {
		OpenOnHover = 'OpenOnHover',
	}
}
