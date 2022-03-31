/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function LogMessage(message: string): void {
		if (OSUIFramework.Helper.LogMessage(message)) {
			console.log(OSUIFramework.Helper.LogMessage(message));
		}
	}
}
