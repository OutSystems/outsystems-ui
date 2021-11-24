// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs.Enum {
	/**
	 * Tabs Enum for CSS Classes
	 */
	export enum CssClasses {
		ActiveTab = 'osui-tabs--is-active',
		IsVertical = 'osui-tabs--is-vertical',
		IsHorizontal = 'osui-tabs--is-horizontal',
		IsJustified = 'osui-tabs--is-justified',
		Modifier = 'osui-tabs--is-',
		TabsWrapper = 'osui-tabs',
		TabsHeader = 'osui-tabs__header',
		TabsContent = 'osui-tabs__content',
		TabsHeaderItem = 'osui-tabs__header-item',
		TabsContentItem = 'osui-tabs__content-item',
	}

	export enum Attributes {
		DataTab = 'data-tab',
		DataOrientation = 'data-orientation',
		DataPosition = 'data-position',
		TabsHeight = '--tabs-height',
	}

	export enum ScrollBehavior {
		Instant = 'auto',
		Smooth = 'smooth',
	}

	export enum Properties {
		ActiveTab = 'ActiveTab',
		DisableAnimation = 'DisableAnimation',
		Height = 'Height',
		IsJustified = 'IsJustified',
		Orientation = 'Orientation',
		Position = 'Position',
	}
}
