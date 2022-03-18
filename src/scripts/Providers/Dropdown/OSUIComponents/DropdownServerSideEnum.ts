// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents.Enum {
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
	export enum Class {
		BalloonContainer = 'osui-dropdown-serverside__balloon-container',
		BalloonContent = 'osui-dropdown-serverside__balloon-content',
		BalloonFooter = 'osui-dropdown-serverside__balloon-footer',
		BalloonHasNotSearchInput = 'osui-dropdown-serverside__balloon--has-not-search-input',
		BalloonPositionBottom = 'osui-dropdown-serverside__balloon--is-bottom',
		BalloonPositionTop = 'osui-dropdown-serverside__balloon--is-top',
		BalloonSearch = 'osui-dropdown-serverside__balloon-search',
		BalloonWrapper = 'osui-dropdown-serverside__balloon-wrapper',
		ErrorMessage = 'osui-dropdown-serverside-error-message',
		FocusBottomHtmlElement = 'osui-dropdown-serverside__balloon-focus-bottom',
		FocusTopHtmlElement = 'osui-dropdown-serverside__balloon-focus-top',
		IsDisabled = 'osui-dropdown-serverside--is-disabled',
		IsOpened = 'osui-dropdown-serverside--is-opened',
		NotValid = 'osui-dropdown-serverside--not-valid',
		Pattern = 'osui-dropdown-serverside',
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
		MaxHeight = 320,
	}
}
