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
		BalloonContent = 'osui-dropdown-serverside__balloon-content',
		BalloonFooter = 'osui-dropdown-serverside__balloon-footer',
		BalloonPositionBottom = 'osui-dropdown-serverside__balloon--is-bottom',
		BalloonPositionTop = 'osui-dropdown-serverside__balloon--is-top',
		BalloonSearch = 'osui-dropdown-serverside__balloon-search',
		BalloonWrapper = 'osui-dropdown-serverside__balloon-wrapper',
		BalloonWrapperIsDisabled = 'osui-dropdown-serverside__balloon-wrapper--is-disabled',
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
}
