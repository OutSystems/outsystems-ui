// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Auxiliar method that will return the container where the scroll will be set
	 *
	 * @return {*}  {(HTMLElement | Document)}
	 */
	function getScrollableScreenContainer(): HTMLElement | Document {
		// Store the layout native element
		const layoutNative = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.LayoutNative);
		// Store the container element
		let scrollableContainer = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.ActiveScreen);

		// Check based on the OS once Helper.DeviceInfo.Is* are returning false in all cases since body classes are not set when this will be executed.
		// Check also if layout-native exist in order to grant this will only occurs when that's the case
		if (Helper.DeviceInfo.GetOperatingSystem() === GlobalEnum.MobileOS.IOS && layoutNative !== undefined) {
			scrollableContainer = Helper.Dom.ClassSelector(
				document,
				`${GlobalEnum.CssClassElements.ActiveScreen} ${Constants.Dot}${GlobalEnum.CssClassElements.Content}`
			);
		}

		// If any of the elements above has been found, probably user is using it's own laytout, in those cases body will be set as scrollable container.
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
			super(getScrollableScreenContainer(), GlobalEnum.HTMLEvent.Scroll);
			this.eventCallback = this._screenTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _screenTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}

		/**
		 * Method to set a new handler and update the target if it's the case.
		 * - At screen transitions if we do not update the eventTarget this event will be lost since the container will not be the same instance at the new screen!
		 *
		 * @param {GlobalCallbacks.OSGeneric} handler
		 * @memberof ScreenOnScroll
		 */
		public addHandler(handler: GlobalCallbacks.OSGeneric): void {
			// Check if the current eventTarget is different from the current one.
			if (this.eventTarget !== getScrollableScreenContainer()) {
				// Remove the assigned event from the previous eventTarget
				this.removeEvent();
				// Update the new eventTarget
				this.eventTarget = getScrollableScreenContainer();
				// Reassign the event but to the new target
				this.addEvent();
			}
			// Set handler
			super.addHandler(handler);
		}
	}
}
