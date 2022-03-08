// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		Add = 'add',
		Click = 'click',
		KeyPressed = 'keyPressed',
		Removed = 'removed',
	}

	/**
	 * DropdownServerSide Class
	 */
	export enum Class {
		BalloonContent = 'osui-dropdown-serverside__balloon-content',
		BalloonFooter = 'osui-dropdown-serverside__balloon-footer',
		BalloonSearch = 'osui-dropdown-serverside__balloon-search',
		BalloonWrapper = 'osui-dropdown-serverside__balloon-wrapper',
		BalloonWrapperIsDisabled = 'osui-dropdown-serverside__balloon-wrapper--is-disabled',
		ErrorMessage = 'osui-dropdown-serverside-error-message',
		FocusBottomHtmlElement = 'osui-dropdown-serverside__balloon-focus-bottom',
		FocusTopHtmlElement = 'osui-dropdown-serverside__balloon-focus-top',
		IsDisabled = 'osui-dropdown-serverside--is-disabled',
		IsOpened = 'osui-dropdown-serverside--is-opened',
		NotValid = 'osui-dropdown-serverside--not-valid',
		SelectText = 'osui-dropdown-serverside__text',
		SelectValuesWrapper = 'osui-dropdown-serverside__selected-values-wrapper',
	}

	/**
	 * DropdownServerSide Events
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}

	/**
	 * DropdownServerSide Enum properties
	 */
	export enum Properties {
		AllowMultipleSelection = 'AllowMultipleSelection',
		IsDisabled = 'IsDisabled',
	}
}
