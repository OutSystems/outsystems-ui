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
		 * @param wizardItem Item to register in the wizard
		 */
		addWizardItem(wizardItem: WizardItem.IWizardItem): void;

		/**
		 * Method to remove a wizardItem
		 *
		 * @param uniqueId Unique id of the item to remove
		 */
		removeWizardItem(uniqueId: string): void;
	}
}
