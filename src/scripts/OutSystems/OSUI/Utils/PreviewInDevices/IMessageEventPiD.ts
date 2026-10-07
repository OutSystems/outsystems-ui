// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.PreviewInDevices {
	/**
	 * Defines the interface of data being received by the Preview In Devices, console.
	 */
	export interface IDataPreviewInDevice {
		/**
		 * Pixels to be considered for the top notch for the specific device.
		 */
		notchValue?: number;
		/**
		 * Pixel Ratio do be used within the application being emulated.
		 */
		pixelRatio?: string;
		/**
		 * User agent of the device to be emulated.
		 */
		userAgent?: string;
	}
}
