/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.osuiAPI.Helper {
	/**
	 * Trigger a log message at the console.
	 *
	 * @export
	 * @param {string} message
	 */
	export function LogMessage(message: string): void {
		if (OutSystems.osuiAPI.Constants.enableLogMessages) {
			console.log(message);
		}
	}
}
