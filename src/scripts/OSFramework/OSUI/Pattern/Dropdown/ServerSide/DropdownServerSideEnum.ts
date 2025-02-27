// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide.Enum {
	/**
	 * Notifications Type, From Child (DropdownServerSideItem) to Parent (DropdownServerSide)
	 */
	export enum ChildNotifyActionType {
		Add = 'add',
		Click = 'click',
		KeyPressed = 'keyPressed',
		Removed = 'removed',
	}

	/**
	 * Class
	 */
	export enum CssClass {
		Balloon = 'osui-dropdown-serverside__balloon',
		BalloonContainer = 'osui-dropdown-serverside__balloon-container',
		BalloonContent = 'osui-dropdown-serverside__balloon-content',
		BalloonFooter = 'osui-dropdown-serverside__balloon-footer',
		BalloonHasNotSearchInput = 'osui-dropdown-serverside__balloon--has-not-search',
		BalloonSearch = 'osui-dropdown-serverside__balloon-search',
		BalloonSearchIcon = 'osui-dropdown-serverside__balloon-search-icon',
		ErrorMessage = 'osui-dropdown-serverside-error-message',
		HasBeenMovedToContent = 'osui-dropdown-serverside--at-content',
		IsDisabled = 'osui-dropdown-serverside--is-disabled',
		IsOpened = 'osui-dropdown-serverside--is-opened',
		IsVisible = 'osui-dropdown-serverside-visible',
		NotValid = 'osui-dropdown-serverside--not-valid',
		Pattern = 'osui-dropdown-serverside',
		SearchInputIsFocused = 'osui-dropdown-serverside__search-input--is-focused',
		SelectText = 'osui-dropdown-serverside__text',
		SelectValuesWrapper = 'osui-dropdown-serverside__selected-values-wrapper',
	}

	/**
	 * Events
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}

	/**
	 * Inline CSS variables!
	 */
	export enum InlineCssVariables {
		BalloonMaxHeight = '--osui-dropdown-ss-balloon-max-height',
		InputHeight = '--osui-dropdown-ss-input-height',
		Left = '--osui-dropdown-ss-left',
		ThresholVerticalAnimate = '--osui-dropdown-ss-thresholdanimateval',
		Top = '--osui-dropdown-ss-top',
		Width = '--osui-dropdown-ss-width',
	}

	/**
	 * All elements where Dropdown can be added into and changes must be done
	 */
	export enum InsidePattern {
		BottomSheet = '.osui-bottom-sheet',
		Notification = '.osui-notification',
		Sidebar = '.osui-sidebar',
	}

	/**
	 * Enum properties
	 */
	export enum Properties {
		AllowMultipleSelection = 'AllowMultipleSelection',
		IsDisabled = 'IsDisabled',
	}

	/**
	 * Enum properties values
	 */
	export enum PropertiesValues {
		BalloonOptionsWrapperAriaLabelMultipleValue = 'Select one or more options',
		BalloonOptionsWrapperAriaLabelSingleValue = 'Select an option',
		MaxHeight = 320,
		SelectValuesWrapperAriaLabelValue = 'Select an option',
		ThresholVerticalAnimateValue = 20,
	}
}
