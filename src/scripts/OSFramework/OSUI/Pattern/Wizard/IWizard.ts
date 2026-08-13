// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Wizard {
	/**
	 * Defines the interface for OutSystemsUI Wizard Pattern
	 */
	export interface IWizard extends Interface.IParent {
		/**
		 * Configuration object
		 */
		configs: WizardConfig;

		/**
		 * Method to add a new wizardItem
		 *
		 * @param {WizardItem.IWizardItem} wizardItem
		 * @memberof IWizard
		 */
		addWizardItem(wizardItem: WizardItem.IWizardItem): void;

		/**
		 * Method to remove a wizardItem
		 *
		 * @param {string} uniqueId
		 * @memberof IWizard
		 */
		removeWizardItem(uniqueId: string): void;
	}
}
