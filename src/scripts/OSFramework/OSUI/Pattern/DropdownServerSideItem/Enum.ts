// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/DropdownServerSideItem/Enum.ts
namespace OSFramework.Patterns.DropdownServerSideItem.Enum {
========
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/DropdownServerSideItem/Enum.ts
	/**
	 * DropdownServerSideItem Enum for CSS Classes
	 */
	export enum CssClass {
		DropdownParentBalloon = 'osui-dropdown-serverside__balloon-wrapper',
		IsSelected = 'osui-dropdown-serverside-item--is-selected',
	}

	/**
	 * DropdownServerSideItem Events
	 */
	export enum Events {
		OnSelected = 'OnSelected',
	}

	/**
	 * DropdownServerSideItem Enum properties
	 */
	export enum Properties {
		IsSelected = 'IsSelected',
		ItemId = 'ItemId',
	}
}
