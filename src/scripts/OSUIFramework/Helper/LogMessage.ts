/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Helper {
	/**
	 * Trigger a log message at the console.
	 *
	 * @export
	 * @param {string} message
	 */
	export function LogMessage(message: string): string {
		if (Constants.enableLogMessages) {
			return message;
		}
	}
}
