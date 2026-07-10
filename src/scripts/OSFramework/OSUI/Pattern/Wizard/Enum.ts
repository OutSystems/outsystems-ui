// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Wizard.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		Add = 'add',
		Removed = 'removed',
	}

	/**
	 * Wizard Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-wizard',
		IsHorizontal = 'is-horizontal',
		IsInteractive = 'is-interactive',
		IsProgressOnly = 'is-progress-only',
		IsVertical = 'is-vertical',
	}

	/**
	 * Wizard Enum for Properties
	 */
	export enum Properties {
		ExtendedClass = 'ExtendedClass',
		IsVertical = 'IsVertical',
		StepBehavior = 'StepBehavior',
	}

	/**
	 * Wizard Enum for Step Behavior
	 */
	export enum StepBehavior {
		Interactive = 'Interactive',
		ProgressOnly = 'ProgressOnly',
	}
}
