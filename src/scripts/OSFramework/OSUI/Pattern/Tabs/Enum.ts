// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs.Enum {
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
		UpdateIndicator = 'update-indicator',
	}

	/**
	 * Tabs Enum for CSS Classes
	 */
	export enum CssClasses {
		ActiveTab = 'osui-tabs--is-active',
		IsVertical = 'osui-tabs--is-vertical',
		IsHorizontal = 'osui-tabs--is-horizontal',
		IsJustified = 'osui-tabs--is-justified',
		HasContentAutoHeight = 'osui-tabs--has-auto-height',
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
		TabsContentItemOverflow = '--tabs-content-item-overflow',
		TabsHeaderItems = '--tabs-header-items',
		TabsHeight = '--tabs-height',
		TabsIndicatorSize = '--tabs-indicator-size',
		TabsIndicatorTransform = '--tabs-indicator-transform',
	}

	/**
	 * Tabs Enum for Properties
	 */
	export enum Properties {
		ContentAutoHeight = 'ContentAutoHeight',
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
	 * Tabs Enum for Selectors of elements that can block OnChange event
	 */
	export enum ElementsBlockingOnChange {
		Dropdown = '.pop-comp-active',
	}

	/**
	 * Tabs Enum for Tabs child types
	 */
	export enum ChildTypes {
		TabsContentItem = 'TabsContentItem',
		TabsHeaderItem = 'TabsHeaderItem',
	}

	/**
	 * Callbacks eventName
	 */
	export enum Events {
		OnChange = 'OnChange',
	}
}
