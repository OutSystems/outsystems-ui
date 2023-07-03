// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Gallery/Enum.ts
namespace OSFramework.Patterns.Gallery.Enum {
========
namespace OSFramework.OSUI.Patterns.Gallery.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Gallery/Enum.ts
	/**
	 * Gallery CSS Variables
	 *
	 * @export
	 * @enum {number}
	 */
	export enum CssVariables {
		PatternItemsDesktop = '--gallery-desktop-items',
		PatternItemsTablet = '--gallery-tablet-items',
		PatternItemsPhone = '--gallery-phone-items',
		PatternItemsGap = '--gallery-gap',
		PatternListItemsDesktop = '--gallery-list-desktop-items',
		PatternListItemsTablet = '--gallery-list-tablet-items',
		PatternListItemsPhone = '--gallery-list-phone-items',
	}
	/**
	 * Gallery Enum properties
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Properties {
		ItemsGap = 'ItemsGap',
		RowItemsDesktop = 'RowItemsDesktop',
		RowItemsPhone = 'RowItemsPhone',
		RowItemsTablet = 'RowItemsTablet',
		MinRowItemsAllowed = 1,
	}
}
