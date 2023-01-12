/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function LogMessage(message: string): void {
		if (OSFramework.OSUI.Helper.LogMessage(message)) {
			console.log(OSFramework.OSUI.Helper.LogMessage(message));
		}
	}
}
