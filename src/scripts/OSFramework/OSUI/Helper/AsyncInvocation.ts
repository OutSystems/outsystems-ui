// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	/**
	 * Method that should be used in order to grant given callbacks will be async
	 *
	 * @export
	 * @param {GlobalCallbacks.Generic} callback
	 * @param {...unknown[]} args
	 * @return {*}  {(number)}
	 */
	export function AsyncInvocation(callback: GlobalCallbacks.Generic, ...args: unknown[]): number {
		if (callback) {
			return window.setTimeout(() => callback(...args), 0);
		}
		return 0;
	}

	/**
	 * Method to be used when a setTimeout is needed
	 *
	 * @export
	 * @param {GlobalCallbacks.Generic} callback
	 * @param {number} time
	 * @param {...unknown[]} args
	 * @return {*}  {(number)}
	 */
	export function ApplySetTimeOut(callback: GlobalCallbacks.Generic, time: number, ...args: unknown[]): number {
		if (callback) {
			return window.setTimeout(() => callback(...args), time);
		}
		return 0;
	}
}
