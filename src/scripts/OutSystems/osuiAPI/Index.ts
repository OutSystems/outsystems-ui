/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI {
	/**
	 * Function that returns the OutSystemsUI version value
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function GetVersion(): string {
		const version = '2.6.9';
		return 'OutSystems UI - Version ' + version;
	}

	/**
	 * Function used to check if has MasterDetail, this is used only for native apps
	 *
	 * @export
	 */
	export function HasMasterDetail(): void {
		const masterDetail: HTMLElement = document.querySelector('.split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			content.classList.add('has-master-detail');
		}
	}

	/**
	 * [Deprecated] Function used to Toogle a class to a given element
	 *
	 * @export
	 * @param {HTMLElement} el
	 * @param {*} state
	 * @param {string} className
	 */
	export function ToggleClass(el: HTMLElement, state: unknown, className: string): void {
		const classList = el.classList;

		if (!state) {
			setTimeout(function () {
				if (!state) {
					classList.remove(className);
				}
			}, 500);
		} else {
			classList.add(className);
			el.offsetHeight;
		}

		console.warn('osui.toggleClass(), is deprecated. Avoid use this method.');
	}

	/**
	 * [Deprecated] Function to get closest element, in use by AnimatedLabel
	 *
	 * @export
	 * @param {HTMLElement} elem
	 * @param {string} selector
	 * @return {*}  {*}
	 *
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export function GetClosest(elem: HTMLElement, selector: string): any {
		console.warn('osui.GetClosest(), is deprecated. Avoid use this method.');

		return elem.closest(selector) ? elem.closest(selector) : false;
	}
}
