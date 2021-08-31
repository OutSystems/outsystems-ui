// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	declare const window: any;
	// eslint-disable-next-line @typescript-eslint/naming-convention

	/**
	 * Method that returns if App is running as a Native App
	 *
	 * @export
	 * @return {*}  {boolean}
	 */
	export function IsRunningAsNativeApp(): boolean {
		return window.cordova !== undefined && !IsRunningAsPWA();
	}
}
