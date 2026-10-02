// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown {
	/**
	 * Defines the interface for OutSystemsUI Dropdown Pattern
	 */
	export interface IDropdown extends Interface.IPattern {
		/**
		 * Method used to clear any selected values from the Dropdown
		 */
		clear(): void;

		/**
		 * Method used to close the Dropdown
		 */
		close(): void;

		/**
		 * Method used to set Dropdown as disabled
		 */
		disable(): void;

		/**
		 * Method used to set Dropdown is enabled
		 */
		enable(): void;

		/**
		 * Method used to get the selected values
		 */
		getSelectedValues(): string;

		/**
		 * Method used to open the Dropdown
		 */
		open(): void;

		/**
		 * Method used to set the extensibility configs based on provider
		 */
		setProviderConfigs(providerConfigs: ProviderConfigs): void;

		/**
		 * Method used to set the extensibility events based on provider
		 */
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;

		/**
		 * Method used to unset the extensibility events that was previously added
		 */
		unsetProviderEvent(eventId: string): void;

		/**
		 * Method used to set the validation status, and also pass the message to show
		 *
		 * @param isValid
		 * @param validationMessage
		 */
		validation(isValid: boolean, validationMessage: string): void;
	}
}
