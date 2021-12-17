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
		HasDragGestures = 'osui-tabs--has-drag',
		Modifier = 'osui-tabs--is-',
		TabsWrapper = 'osui-tabs',
		TabsHeader = 'osui-tabs__header',
		TabsContent = 'osui-tabs__content',
		TabsHeaderItem = 'osui-tabs__header-item',
		TabsContentItem = 'osui-tabs__content-item',
	}

	/**
	 * Tabs Enum for HTML Attributes
	 */
	export enum Attributes {
		DataTab = 'data-tab',
	}

	/**
	 * Tabs Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		TabsHeight = '--tabs-height',
	}

	/**
	 * Tabs Enum for Properties
	 */
	export enum Properties {
		Height = 'Height',
		JustifyHeaders = 'JustifyHeaders',
		StartingTab = 'StartingTab',
		TabsOrientation = 'TabsOrientation',
		TabsVerticalPosition = 'TabsVerticalPosition',
	}

	/**
	 * Tabs Enum for Intersection Observer options
	 */
	export enum ObserverOptions {
		RootMargin = '1px',
	}
}
