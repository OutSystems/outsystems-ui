// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
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
