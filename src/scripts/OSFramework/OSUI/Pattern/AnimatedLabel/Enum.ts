// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/AnimatedLabel/Enum.ts
namespace OSFramework.Patterns.AnimatedLabel.Enum {
========
namespace OSFramework.OSUI.Patterns.AnimatedLabel.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/AnimatedLabel/Enum.ts
	/**
	 * AnimatedLabel Enums
	 */

	export enum AnimationEvent {
		OnAutoFillStart = 'onAutoFillStart',
	}

	// Css Classes
	export enum CssClasses {
		InputPlaceholder = 'animated-label-input',
		IsActive = 'active',
		LabelPlaceholder = 'animated-label-text',
		Pattern = 'animated-label',
	}

	// Warning/Error messages
	export enum Messages {
		InputNotFound = 'Missing input or textarea.',
		LabelNotFound = 'We notice that a label is missing inside the Label Placeholder. In order to grant accessibility add it and assign the Input Widget accordingly.',
	}
}
