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
		BalloonContainer = 'osui-dropdown-serverside__balloon-container',
		BalloonContent = 'osui-dropdown-serverside__balloon-content',
		BalloonFooter = 'osui-dropdown-serverside__balloon-footer',
		BalloonHasNotSearchInput = 'osui-dropdown-serverside__balloon--has-not-search',
		BalloonPositionBottom = 'osui-dropdown-serverside__balloon--is-bottom',
		BalloonPositionTop = 'osui-dropdown-serverside__balloon--is-top',
		BalloonSearch = 'osui-dropdown-serverside__balloon-search',
		BalloonWrapper = 'osui-dropdown-serverside__balloon-wrapper',
		ErrorMessage = 'osui-dropdown-serverside-error-message',
		IsDisabled = 'osui-dropdown-serverside--is-disabled',
		IsInsidePopup = 'osui-dropdown-serverside--is-inside-popup',
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
