// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Auxiliar method that will return the container where the scroll will be set
	 *
	 * @return {*}  {(HTMLElement | Document)}
	 */
	function scrollableScreenContainer(): HTMLElement | Document {
		// Store the container element
		let scrollableContainer: HTMLElement | Document = undefined;

		// If native app, scrollable container will be the .content inside .active-scren
		if (OSFramework.OSUI.Helper.DeviceInfo.IsNative) {
			scrollableContainer = Helper.Dom.ClassSelector(
				document,
				`${GlobalEnum.CssClassElements.ActiveScreen} ${Constants.Dot}${GlobalEnum.CssClassElements.Content}`
			);
		} else {
			// At non native apps, .active-screen is the one container with scroll
			scrollableContainer = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.ActiveScreen);
		}

		// If any of the elements above has been find, probably user is using it's own laytout, in those cases body will be set as scrollable container.
		return scrollableContainer !== undefined ? scrollableContainer : document.body;
	}

	/**
	 * Class that represents the scroll on the active screen element.
	 *
	 * @export
	 * @class ScreenOnScroll
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class ScreenOnScroll extends AbstractListener<string> {
		constructor() {
			super(scrollableScreenContainer(), GlobalEnum.HTMLEvent.Scroll);
			this.eventCallback = this._screenTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _screenTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}
	}
}
