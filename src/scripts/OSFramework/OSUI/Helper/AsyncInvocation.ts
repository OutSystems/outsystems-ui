// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	/**
	 * Method that should be used in order to grant given callbacks will be async
	 *
	 * @export
	 * @param {GlobalCallbacks.Generic} callback
	 * @param {...unknown[]} args
	 */
	export function AsyncInvocation(callback: GlobalCallbacks.Generic, ...args: unknown[]): void {
		if (callback) setTimeout(() => callback(...args), 0);
	}

	/**
	 * Method to be used when a setTimeout is needed
	 *
	 * @export
	 * @param {GlobalCallbacks.Generic} callback
	 * @param {number} time
	 * @param {...unknown[]} args
	 */
	export function ApplySetTimeOut(callback: GlobalCallbacks.Generic, time: number, ...args: unknown[]): void {
		if (callback) setTimeout(() => callback(...args), time);
	}
}
