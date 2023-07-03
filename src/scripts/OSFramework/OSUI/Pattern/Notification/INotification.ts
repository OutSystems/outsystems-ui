// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Notification/INotification.ts
namespace OSFramework.Patterns.Notification {
========
namespace OSFramework.OSUI.Patterns.Notification {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Notification/INotification.ts
	/**
	 * Defines the interface for OutSystemsUI Notification Pattern
	 */
	export interface INotification extends Interface.IPattern {
		hide(): void;
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		show(): void;
	}
}
