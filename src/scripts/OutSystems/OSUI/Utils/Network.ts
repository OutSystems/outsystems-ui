// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Network {
	/**
	 * Checks if device is online
	 * @returns
	 */
	export function IsOnline(): boolean {
		// Uses navigator to check if device is online
		return navigator.onLine;
	}

	/**
	 * Get connection type
	 * @returns
	 */
	export function Type(): string {
		let typeofConnection = 'webbrowser';

		if (navigator.connection !== undefined && navigator.connection.type !== undefined) {
			//In a mobile device
			typeofConnection = navigator.connection.type;
		}

		return typeofConnection;
	}
}
