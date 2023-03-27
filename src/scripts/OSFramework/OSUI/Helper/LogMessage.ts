/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Helper {
	/**
	 * Trigger a log message at the console.
	 *
	 * @export
	 * @param {string} message
	 */
	export function LogMessage(message: string): string {
		if (Constants.EnableLogMessages) {
			return message;
		}
	}
}
