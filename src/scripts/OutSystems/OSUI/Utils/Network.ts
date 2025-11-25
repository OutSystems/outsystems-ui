// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Network {
	/**
	 * Checks if device is online
	 *
	 * @returns
	 */
	export function IsOnline(): boolean {
		// This method can't implement the CreateApiResponse method since it's defined as a function in SS
		// Uses navigator to check if device is online
		return navigator.onLine;
	}

	/**
	 * Get connection type
	 *
	 * @returns
	 */
	export function Type(): string {
		// This method can't implement the CreateApiResponse method since it's defined as a function in SS
		let typeofConnection = 'webbrowser';

		if (navigator.onLine) {
			if (navigator.connection?.type) {
				typeofConnection = navigator.connection.type;
			} else {
				typeofConnection = 'unknown';
			}
		} else {
			typeofConnection = 'none';
		}

		return typeofConnection;
	}
}
