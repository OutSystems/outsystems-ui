// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown {
	/**
	 * Defines the interface for OutSystemsUI Dropdown Pattern
	 */
	export interface IDropdown extends Interface.IPattern {
		/**
		 * Method used to clear any selected values from the Dropdown
		 *
		 * @memberof IDropdown
		 */
		clear(): void;

		/**
		 * Method used to set Dropdown as disabled
		 *
		 * @memberof IDropdown
		 */
		disable(): void;

		/**
		 * Method used to set Dropdown is enabled
		 *
		 * @memberof IDropdown
		 */
		enable(): void;

		/**
		 * Method used to get the selected values
		 *
		 * @memberof IDropdown
		 */
		getSelectedValues(): string;

		/**
		 * Method used to set a given dropdownOptionId as an option item from Dropdown instance
		 *
		 * @param optionItemId Dropdown Option Item Id to be stored
		 */
		setNewOptionItem(optionItemId: string): boolean;

		/**
		 * Method used to set the validation status, and also pass the message to show
		 *
		 * @param {boolean} isValid
		 * @param {string} validationMessage
		 * @memberof IDropdown
		 */
		validation(isValid: boolean, validationMessage: string): void;
	}
}
