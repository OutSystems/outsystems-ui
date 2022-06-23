// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		AddContentItem = 'add-content-item',
		AddHeaderItem = 'add-header-item',
		Click = 'click',
		RemovedContentItem = 'removed-content-item',
		RemovedHeaderItem = 'removed-header-item',
		DisabledHeaderItem = 'disabled-header-item',
		EnabledHeaderItem = 'enabled-header-item',
	}

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
		TabsIndicatorElem = 'osui-tabs__header__indicator',
	}

	/**
	 * Tabs Enum for HTML Attributes
	 */
	export enum Attributes {
		DataTab = 'data-tab',
		DataDirection = 'data-direction',
	}

	/**
	 * Tabs Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		TabsHeight = '--tabs-height',
		TabsHeaderItems = '--tabs-header-items',
		TabsIndicatorScale = '--tabs-indicator-scale',
		TabsIndicatorTransform = '--tabs-indicator-transform',
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

	/**
	 * Tabs Enum for Tabs child types
	 */
	export enum ChildTypes {
		TabsContentItem = 'TabsContentItem',
		TabsHeaderItem = 'TabsHeaderItem',
	}
}
