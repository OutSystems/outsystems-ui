// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	//declare const window: any;
	/**
	 *
	 *
	 * @export
	 * @return {*}  {boolean}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function IsRunningAsPWA(): boolean {
		const IsRunningAsPWA =
			(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
			window.navigator.standalone === true;

		return IsRunningAsPWA;
	}
}
