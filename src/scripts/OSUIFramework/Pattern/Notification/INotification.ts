// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Notification Pattern
	 */
	export interface INotification extends Interface.IPattern, Interface.ICallback {
		hide(): void;
		show(): void;
	}
}
