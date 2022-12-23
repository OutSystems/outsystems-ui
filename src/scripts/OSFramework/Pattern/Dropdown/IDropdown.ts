// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Dropdown {
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

		// Set as optional, to not make mandatory DropdownSErverItem to implement these
		setProviderConfigs?(providerConfigs: ProviderConfigs): void;
		setProviderEvent?(eventName: string, callback: OSFramework.GlobalCallbacks.Generic, uniqueId: string): void;
		unsetProviderEvent?(eventId: string): void;

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
