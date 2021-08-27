// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	declare const window: any;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	/**
	 *
	 *
	 * @export
	 * @return {*}  {boolean}
	 */
	export function IsRunningAsNativeApp(): boolean {
		const IsRunningAsNativeApp = window.cordova !== undefined && !IsRunningAsPWA();
		return IsRunningAsNativeApp;
	}
}
