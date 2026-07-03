/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.Wizard {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Wizard extends AbstractParent<WizardConfig, WizardItem.IWizardItem> implements IWizard {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new WizardConfig(configs));
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to add a new wizardItem
		 *
		 * @param {WizardItem.IWizardItem} childItem
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public addWizardItem(childItem: WizardItem.IWizardItem): void {
			if (this.getChild(childItem.uniqueId)) {
				throw new Error(
					`${ErrorCodes.Wizard.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternName.WizardItem} under Id: '${childItem.widgetId}' added to ${GlobalEnum.PatternName.Wizard} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(childItem);
			}
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childItem Child Item to be stored/managed
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public beNotifiedByChild(childItem: WizardItem.IWizardItem, notifiedTo: Enum.ChildNotifyActionType): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this.addWizardItem(childItem);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this.removeWizardItem(childItem.uniqueId);
					break;
				default:
					throw new Error(
						`${ErrorCodes.Wizard.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		/**
		 * Method to build the Wizard
		 *
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public build(): void {
			super.build();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		/**
		 * Method to destroy wizard instance
		 *
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public dispose(): void {
			super.dispose();
		}

		/**
		 * Method to remove a wizardItem
		 *
		 * @param {string} childId
		 * @memberof OSFramework.Patterns.Wizard.Wizard
		 */
		public removeWizardItem(childId: string): void {
			// Check if the given ChildId exist at childList
			if (this.getChild(childId)) {
				// Remove item
				this.unsetChild(childId);
			} else {
				throw new Error(
					`${ErrorCodes.Wizard.FailUnsetNewChildItem}: The ${GlobalEnum.PatternName.WizardItem} under uniqueId: '${childId}' does not exist as an ${GlobalEnum.PatternName.WizardItem} from ${GlobalEnum.PatternName.Wizard} with Id: ${this.widgetId}.`
				);
			}
		}
	}
}
