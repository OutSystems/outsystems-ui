/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function LogMessage(message: string): void {
		if (OSFramework.Helper.LogMessage(message)) {
			console.log(OSFramework.Helper.LogMessage(message));
		}
	}
}
