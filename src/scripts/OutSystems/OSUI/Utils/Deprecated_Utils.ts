// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * [Deprecated] Function to get closest element, in use by AnimatedLabel
	 *
	 * @export
	 * @param {HTMLElement} elem
	 * @param {string} selector
	 * @return {*}  {*}
	 * @deprecated use 'OSFramework.OSUI.Helper.Dom.GetClosest' instead.
	 *
	 */
	export function GetClosest(elem: HTMLElement, selector: string): unknown {
		console.warn(`This method is deprecated.`);
		return elem.closest(selector) ? elem.closest(selector) : false;
	}

	/**
	 * [Deprecated] Function used to Toogle a class to a given element
	 *
	 * @export
	 * @param {HTMLElement} element
	 * @param {*} state
	 * @param {string} className
	 * @deprecated use 'OSFramework.OSUI.Helper.Dom.Styles.ToggleClass' instead.
	 */
	export function ToggleClass(element: HTMLElement, state: unknown, className: string): void {
		console.warn(`This method is deprecated. Use instead the API OSFramework.OSUI.Helper.Dom.Styles.ToggleClass`);
		if (!state) {
			setTimeout(() => {
				if (!state) {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(element, className);
				}
			}, 500);
		} else {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(element, className);
			element.offsetHeight;
		}
	}

	/**
	 * Function used to check if has MasterDetail, this is used only for native apps,
	 * on the DEPRECATED_LayoutReadyMobile. Removing this now would be a breaking-change
	 * and it needs to be present as long as the DEPRECATED_LayoutReadyMobile isn’t removed.
	 *
	 * @export
	 * @deprecated use 'OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper')' instead.
	 */
	export function HasMasterDetail(): boolean {
		console.warn(
			`This method is deprecated. Use instead the API OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper')`
		);
		let returnOutput = false;

		const masterDetail = OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(content, 'has-master-detail');
			returnOutput = true;
		}

		return returnOutput;
	}
}

namespace OutSystems.OSUI.Utils.LayoutPrivate {
	/**
	 * Function used to set the RTL observer
	 *
	 * @param callback
	 * @returns
	 * @deprecated use 'OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler' instead.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function RTLObserver(callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
		console.warn(
			`This method is deprecated. Use instead the API OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler`
		);
		OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler(
			OSFramework.OSUI.Event.DOMEvents.Observers.ObserverEvent.RTL,
			callback
		);
	}
}
