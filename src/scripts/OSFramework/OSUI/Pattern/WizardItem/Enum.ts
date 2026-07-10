// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.WizardItem.Enum {
	/**
	 * Communication between Wizard and WizardItem - Notification Type
	 */
	export enum ParentNotifyActionType {
		HasNewProps = 'hasNewProps',
	}

	/**
	 * WizardItem Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-wizard-item',
		HasReverseLabelPosition = 'is-reversed',
		IsActive = 'is-active',
		IsNext = 'is-next',
		IsPast = 'is-past',
		WizardContentLabel = 'osui-wizard-item-label',
	}

	/**
	 * WizardItem Enum for Events
	 */
	export enum Events {
		OnClick = 'OnClick',
	}

	/**
	 * WizardItem Enum for Properties
	 */
	export enum Properties {
		ExtendedClass = 'ExtendedClass',
		Status = 'Status',
		ReverseLabelPosition = 'ReverseLabelPosition',
	}

	/**
	 * WizardItem Enum for Status
	 */
	export enum Status {
		Active = 'active',
		Next = 'next',
		Past = 'past',
	}
}
