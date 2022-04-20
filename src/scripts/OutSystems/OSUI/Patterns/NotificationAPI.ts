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
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(notificationId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const notification = GetNotificationById(notificationId);

		try {
			notification.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Notification.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
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
	export function Destroy(notificationId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const notification = GetNotificationById(notificationId);

		try {
			notification.dispose();

			_notificationMap.delete(notificationId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Notification.FailDispose;
		}

		return JSON.stringify(responseObj);
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
	export function Hide(notificationId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const notification = GetNotificationById(notificationId);

		try {
			notification.hide();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Notification.FailHide;
		}

		return JSON.stringify(responseObj);
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
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} notificationId
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		notificationId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const _notificationItem = this.GetNotificationById(notificationId);

		try {
			_notificationItem.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Notification.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will open a given notification.
	 *
	 * @export
	 * @param {string} notificationId ID of the notification that will be shown
	 */
	export function Show(notificationId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const notification = GetNotificationById(notificationId);

		try {
			notification.show();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Notification.FailShow;
		}

		return JSON.stringify(responseObj);
	}
}
