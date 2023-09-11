// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.PreviewInDevices {
	/**
	 * Defines the interface of data being received by the Preview In Devices, console.
	 *
	 * @export
	 * @interface IDataPreviewInDevice
	 */
	export interface IDataPreviewInDevice {
		/**
		 * Pixels to be considered for the top notch for the specific device.
		 *
		 * @type {number}
		 * @memberof IDataPreviewInDevice
		 */
		notchValue?: number;
		/**
		 * Pixel Ratio do be used within the application being emulated.
		 *
		 * @type {string}
		 * @memberof IDataPreviewInDevice
		 */
		pixelRatio?: string;
		/**
		 * User agent of the device to be emulated.
		 *
		 * @type {string}
		 * @memberof IDataPreviewInDevice
		 */
		userAgent?: string;
	}
}
