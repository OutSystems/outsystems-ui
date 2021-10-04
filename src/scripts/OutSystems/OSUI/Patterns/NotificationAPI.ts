// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.NotificationAPI {
	const _notificationMap = new Map<string, OSUIFramework.Patterns.Notification.INotification>();
	/**
	 * Function that will change the property of a given Notification.
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	export function ChangeProperty(notificationId: string, propertyName: string, propertyValue: any): void {
		const notification = GetNotificationById(notificationId);
		notification.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Notification instance and add it to the notificationsMap
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} configs
	 * @return {*}  {OSUIFramework.Patterns.Notification.INotification}
	 */
	export function Create(notificationId: string, configs: string): OSUIFramework.Patterns.Notification.INotification {
		if (_notificationMap.has(notificationId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Notification} registered under id: ${notificationId}`
			);
		}

		const _newNotification = new OSUIFramework.Patterns.Notification.Notification(
			notificationId,
			JSON.parse(configs)
		);
		_notificationMap.set(notificationId, _newNotification);
		return _newNotification;
	}

	/**
	 * Function that will destroy the instance of the given Notification
	 *
	 * @export
	 * @param {string} notificationId
	 */
	export function Destroy(notificationId: string): void {
		const notification = GetNotificationById(notificationId);

		notification.dispose();

		_notificationMap.delete(notificationId);
	}

	/**
	 * Fucntion that will return the Map with all the Notification instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllNotifications(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_notificationMap);
	}

	/**
	 * Function that gets the instance of Notification, by a given ID.
	 *
	 * @export
	 * @param {string} notificationId
	 * @return {*}  {OSUIFramework.Patterns.Notification.INotification}
	 */
	export function GetNotificationById(notificationId: string): OSUIFramework.Patterns.Notification.INotification {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Notification',
			notificationId,
			_notificationMap
		) as OSUIFramework.Patterns.Notification.INotification;
	}

	/**
	 * Function that will Show a given notification.
	 *
	 * @export
	 * @param {string} notificationId ID of the notification that will be hidden
	 */
	export function Hide(notificationId: string): void {
		const notification = GetNotificationById(notificationId);

		notification.hide();
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} notificationId
	 * @return {*}  {OSUIFramework.Patterns.Notification.INotification}
	 */
	export function Initialize(notificationId: string): OSUIFramework.Patterns.Notification.INotification {
		const notification = GetNotificationById(notificationId);

		notification.build();

		return notification;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {OSUIFramework.Callbacks.OSNotificationToggleEvent} callback
	 */
	export function RegisterCallback(
		notificationId: string,
		callback: OSUIFramework.Callbacks.OSNotificationToggleEvent
	): void {
		const notification = GetNotificationById(notificationId);

		notification.registerCallback(callback);
	}

	/**
	 * Function that will open a given notification.
	 *
	 * @export
	 * @param {string} notificationId ID of the notification that will be shown
	 */
	export function Show(notificationId: string): void {
		const notification = GetNotificationById(notificationId);

		notification.show();
	}
}
