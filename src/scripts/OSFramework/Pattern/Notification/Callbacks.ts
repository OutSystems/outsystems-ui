// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Notification.Callbacks {
	export type OSOnToggleEvent = {
		(notificationId: string, isOpen: boolean): void;
	};
	export type OSInitializedEvent = {
		(notificationId: string): void;
	};
}
