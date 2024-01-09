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

		// If native or pwa app when NOT android, scrollable container will be the .content inside .active-scren
		switch (Helper.DeviceInfo.GetOperatingSystem()) {
			case GlobalEnum.MobileOS.Android:
			case GlobalEnum.MobileOS.MacOS:
			case GlobalEnum.MobileOS.Unknown:
			case GlobalEnum.MobileOS.Windows:
				scrollableContainer = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.ActiveScreen);
				break;
			case GlobalEnum.MobileOS.IOS:
				scrollableContainer = Helper.Dom.ClassSelector(
					document,
					`${GlobalEnum.CssClassElements.ActiveScreen} ${Constants.Dot}${GlobalEnum.CssClassElements.Content}`
				);
				break;
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

		/**
		 * Method to set a new handler and update the target if it's the case.
		 * - At screen transitions if we do not update the eventTarget this event will be lost since the container will not be the same instance at the new screen!
		 *
		 * @param {GlobalCallbacks.OSGeneric} handler
		 * @memberof ScreenOnScroll
		 */
		public addHandler(handler: GlobalCallbacks.OSGeneric): void {
			// Check if the current eventTarget is different from the current one.
			if (this.eventTarget !== scrollableScreenContainer()) {
				// Remove the assigned event from the previous eventTarget
				this.removeEvent();
				// Update the new eventTarget
				this.eventTarget = scrollableScreenContainer();
				// Reassign the event but to the new target
				this.addEvent();
			}
			// Set handler
			super.addHandler(handler);
		}
	}
}
