// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs.Enum {
	/**
	 * Tabs Enum properties
	 */
	export enum Properties {}
	//Implement you code here
	/**
	 * Tabs Enum for CSS Classes
	 */
	export enum CssClasses {
		ActiveTab = 'is--active',
		IsVertical = 'is--vertical',
		IsHorizontal = 'is--horizontal',
		IsJustified = 'is--justified',
		Tabs = 'osui-tabs',
		TabsHeader = 'osui-tabs_header',
		TabsContent = 'osui-tabs_content',
		TabsHeaderItem = 'osui-tabs_header-item',
		TabsContentItem = 'osui-tabs_content-item',
	}

	export enum Attributes {
		DataTab = 'data-tab',
		DataOrientation = 'data-orientation',
		DataPosition = 'data-position',
		TabsHeight = '--tabs-height',
	}

	export enum OnChangeBehavior {
		Instant = 'auto',
		Smooth = 'smooth',
	}

	export enum Properties {
		ActiveTab = 'ActiveTab',
		Height = 'Height',
		IsJustified = 'IsJustified',
		Orientation = 'Orientation',
		Position = 'Position',
	}
}
