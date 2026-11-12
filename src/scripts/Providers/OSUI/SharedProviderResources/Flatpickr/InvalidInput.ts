// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr.InvalidInput {
	/**
	 * Provider configs that make Flatpickr parse typed text strictly and report it when it is rejected,
	 * instead of saving a different date or clearing the text silently (options added to the OutSystems fork).
	 * Off by default: only turned on by the pattern's StrictInputValidation config.
	 *
	 * @param isEnabled Whether the strict validation is turned on (StrictInputValidation)
	 * @param onInvalidInput Handler called by Flatpickr when the typed text is rejected
	 * @returns The provider configs to merge into the picker configs
	 */
	export function GetProviderConfigs(
		isEnabled: boolean,
		onInvalidInput: OSFramework.OSUI.GlobalCallbacks.Generic
	): FlatpickrOptions {
		return {
			keepInvalidInput: isEnabled === true,
			onInvalidInput: onInvalidInput,
			strictInputParsing: isEnabled === true,
		} as FlatpickrOptions;
	}

	/**
	 * Mark the typed text as invalid: aria-invalid on the input the user types in, and a modifier class on the pattern.
	 * The platform's not-valid class is not used, since the platform owns it.
	 *
	 * @param patternElem The pattern root element
	 * @param inputElem The Flatpickr input element (the one the user types in)
	 * @param cssClass The pattern modifier class for the invalid state
	 */
	export function Set(patternElem: HTMLElement, inputElem: HTMLInputElement, cssClass: string): void {
		if (patternElem) {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(patternElem, cssClass);
		}

		if (inputElem) {
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				inputElem,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Invalid,
				OSFramework.OSUI.Constants.A11YAttributes.States.True
			);
		}
	}

	/**
	 * Remove the invalid state set by Set()
	 *
	 * @param patternElem The pattern root element
	 * @param inputElem The Flatpickr input element (the one the user types in)
	 * @param cssClass The pattern modifier class for the invalid state
	 */
	export function Unset(patternElem: HTMLElement, inputElem: HTMLInputElement, cssClass: string): void {
		if (patternElem) {
			OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(patternElem, cssClass);
		}

		if (inputElem) {
			OSFramework.OSUI.Helper.Dom.Attribute.Remove(
				inputElem,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Invalid
			);
		}
	}
}
