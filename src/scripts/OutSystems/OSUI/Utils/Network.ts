// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Network {
	export function CheckDeviceOnline(): boolean {
		// Uses navigator to check if device is online
		return navigator.onLine;
	}

	export function CheckNetworkType(): string {
		if (typeof navigator.connection !== 'undefined') {
			//In a mobile device
			if (typeof navigator.connection.type !== 'undefined') {
				return navigator.connection.type;
			} else {
				//In a web browser
				return 'webbrowser';
			}
		} else {
			//In a web browser
			return 'webbrowser';
		}
	}
}
