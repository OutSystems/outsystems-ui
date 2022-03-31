/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Network {
	export function GetStatus(): boolean {
		return navigator.onLine;
	}

	export function GetType(): string {
		let typeofConnection = 'webbrowser';

		if (navigator.connection !== undefined && navigator.connection.type !== undefined) {
			//In a mobile device
			typeofConnection = navigator.connection.type;
		}

		return typeofConnection;
	}
}
