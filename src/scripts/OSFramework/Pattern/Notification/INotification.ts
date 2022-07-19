// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Notification Pattern
	 */
	export interface INotification extends Interface.IPattern {
		hide(): void;
		registerCallback(eventName: string, callback: Callbacks.OSGeneric): void;
		show(): void;
	}
}
