// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Notification Pattern
	 */
	export interface INotification extends Interface.IPattern {
		hide(): void;
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		show(): void;
	}
}
