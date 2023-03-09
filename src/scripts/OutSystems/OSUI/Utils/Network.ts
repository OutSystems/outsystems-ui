// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Network {
	/**
	 * Checks if device is online
	 *
	 * @returns
	 */
	export function IsOnline(): boolean {
		// This method can't implement the CreateApiResponse method since it's defined as a function at SS
		// Uses navigator to check if device is online
		return navigator.onLine;
	}

	/**
	 * Get connection type
	 *
	 * @returns
	 */
	export function Type(): string {
		// This method can't implement the CreateApiResponse method since it's defined as a function at SS
		let typeofConnection = 'webbrowser';

		if (navigator.connection !== undefined && navigator.connection.type !== undefined) {
			//In a mobile device
			typeofConnection = navigator.connection.type;
		}

		return typeofConnection;
	}
}
