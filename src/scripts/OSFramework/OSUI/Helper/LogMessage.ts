/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<<< HEAD:src/scripts/OSFramework/Helper/LogMessage.ts
namespace OSFramework.Helper {
========
namespace OSFramework.OSUI.Helper {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Helper/LogMessage.ts
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
