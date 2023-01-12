// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown {
	/**
	 * Defines the interface for OutSystemsUI Dropdown Pattern
	 */
	export interface IDropdown extends Interface.IPattern {
		/**
		 * Method used to clear any selected values from the Dropdown
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		clear(): void;

		/**
		 * Method used to close the Dropdown
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		close(): void;

		/**
		 * Method used to set Dropdown as disabled
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		disable(): void;

		/**
		 * Method used to set Dropdown is enabled
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		enable(): void;

		/**
		 * Method used to get the selected values
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		getSelectedValues(): string;

		/**
		 * Method used to open the Dropdown
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		open(): void;

		/**
		 * Method used to set the extensibility configs based on provider
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		setProviderConfigs(providerConfigs: ProviderConfigs): void;

		/**
		 * Method used to set the extensibility events based on provider
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;

		/**
		 * Method used to unset the extensibility events that was previously added
		 *
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		unsetProviderEvent(eventId: string): void;

		/**
		 * Method used to set the validation status, and also pass the message to show
		 *
		 * @param {boolean} isValid
		 * @param {string} validationMessage
		 * @memberof OSFramework.Patterns.Dropdown.IDropdown
		 */
		validation(isValid: boolean, validationMessage: string): void;
	}
}
