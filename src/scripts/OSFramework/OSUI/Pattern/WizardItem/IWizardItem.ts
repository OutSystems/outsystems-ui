// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.WizardItem {
	/**
	 * Defines the interface for OutSystemsUI WizardItem Pattern
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface IWizardItem extends Interface.IChild {
		/**
		 * Method to be notified by the parent that a new property value has been set
		 *
		 * @param {Enum.ParentNotifyActionType} notificationType Notification type
		 * @memberof OSFramework.Patterns.WizardItem.IWizardItem
		 */
		beNotifiedByParent(notificationType: Enum.ParentNotifyActionType): void;
	}
}
