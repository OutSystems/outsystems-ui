// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.NotificationAPI {
	const _notificationMap = new Map<string, OSFramework.OSUI.Patterns.Notification.INotification>();
	/**
	 * Function that will change the property of a given Notification.
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	export function ChangeProperty(notificationId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Notification.FailChangeProperty,
			callback: () => {
				const notification = GetNotificationById(notificationId);

				notification.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Notification instance and add it to the notificationsMap
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.Notification.INotification}
	 */
	export function Create(
		notificationId: string,
		configs: string
	): OSFramework.OSUI.Patterns.Notification.INotification {
		if (_notificationMap.has(notificationId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Notification} registered under id: ${notificationId}`
			);
		}

		const _newNotification = new OSFramework.OSUI.Patterns.Notification.Notification(
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
	export function Dispose(notificationId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Notification.FailDispose,
			callback: () => {
				const notification = GetNotificationById(notificationId);

				notification.dispose();

				_notificationMap.delete(notificationId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Notification instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllNotifications(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_notificationMap);
	}

	/**
	 * Function that gets the instance of Notification, by a given ID.
	 *
	 * @export
	 * @param {string} notificationId
	 * @return {*}  {OSFramework.OSUI.Patterns.Notification.INotification}
	 */
	export function GetNotificationById(notificationId: string): OSFramework.OSUI.Patterns.Notification.INotification {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Notification',
			notificationId,
			_notificationMap
		) as OSFramework.OSUI.Patterns.Notification.INotification;
	}

	/**
	 * Function that will Show a given notification.
	 *
	 * @export
	 * @param {string} notificationId ID of the notification that will be hidden
	 */
	export function Hide(notificationId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Notification.FailHide,
			callback: () => {
				const notification = GetNotificationById(notificationId);

				notification.hide();
			},
		});

		return result;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} notificationId
	 * @return {*}  {OSFramework.OSUI.Patterns.Notification.INotification}
	 */
	export function Initialize(notificationId: string): OSFramework.OSUI.Patterns.Notification.INotification {
		const notification = GetNotificationById(notificationId);

		notification.build();

		return notification;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		notificationId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Notification.FailRegisterCallback,
			callback: () => {
				const _notificationItem = this.GetNotificationById(notificationId);

				_notificationItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that will open a given notification.
	 *
	 * @export
	 * @param {string} notificationId ID of the notification that will be shown
	 */
	export function Show(notificationId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Notification.FailShow,
			callback: () => {
				const notification = GetNotificationById(notificationId);

				notification.show();
			},
		});

		return result;
	}
}
