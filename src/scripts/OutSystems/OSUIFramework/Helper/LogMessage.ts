/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUIFramework.Helper {
	/**
	 * Trigger a log message at the console.
	 *
	 * @export
	 * @param {string} message
	 */
	export function LogMessage(message: string): void {
		if (OutSystems.OSUIFramework.Constants.enableLogMessages) {
			console.log(message);
		}
	}
}
