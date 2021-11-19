// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	/**
	 * Method used to Dynamically Load a Script
	 *
	 * @export
	 * @param {string} url
	 * @param {Callbacks.Generic} callBack
	 * @param {boolean} [isAsync=false]
	 */
	export function DynamicallyLoadScript(url: string, callBack: Callbacks.Generic, isAsync = false): void {
		let script: HTMLScriptElement;

		// Check if the same script has asked to be loaded
		if (document.querySelector('script[src*="' + url + '"]')) {
			script = document.querySelector('script[src*="' + url + '"]');
		} else {
			script = document.createElement('script');

			script.src = url;
			script.async = isAsync;

			document.head.appendChild(script);
		}

		script.addEventListener('load', callBack);
	}
}
