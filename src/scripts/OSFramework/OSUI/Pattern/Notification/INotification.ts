// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Notification Pattern
	 */
	export interface INotification extends Interface.IPattern {
		/**
		 * Method to hide the notification
		 */
		hide(): void;

		/**
		 * Method to show the notification
		 */
		show(): void;
	}
}
