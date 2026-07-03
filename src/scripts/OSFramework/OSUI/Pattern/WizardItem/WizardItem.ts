// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.WizardItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class WizardItem extends AbstractChild<WizardItemConfig, Wizard.IWizard> implements IWizardItem {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new WizardItemConfig(configs));
		}

		// Method to set the parent Info, if a wizard wrapper is being used
		private _setWizardParent(): void {
			// Get parent info
			this.setParentInfo(
				Constants.Dot + Wizard.Enum.CssClass.Pattern,
				OutSystems.OSUI.Patterns.WizardAPI.GetWizardById,
				true
			);

			// Notify parent about a new instance of this child has been created!
			if (this.parentObject) {
				this.notifyParent(Wizard.Enum.ChildNotifyActionType.Add);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to build the WizardItem
		 *
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public build(): void {
			super.build();

			this._setWizardParent();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		/**
		 * Method to destroy WizardItem instance
		 *
		 * @memberof OSFramework.Patterns.WizardItem.WizardItem
		 */
		public dispose(): void {
			if (this.parentObject) {
				// Notify parent about this instance will be destroyed
				this.notifyParent(Wizard.Enum.ChildNotifyActionType.Removed);
			}

			super.dispose();
		}
	}
}
