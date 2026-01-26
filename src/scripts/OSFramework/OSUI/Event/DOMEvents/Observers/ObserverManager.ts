// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	/**
	 * Observer Mananer Class to handle the creation of all observer events
	 *
	 * @export
	 * @class ObserverManager
	 * @extends {AbstractEventsManager<unknown, string>}
	 */
	export class ObserverManager extends AbstractEventsManager<unknown, string> {
		protected getInstanceOfEventType(observerType: Observers.ObserverEvent): Observers.IObserver<unknown, unknown> {
			switch (observerType) {
				case Observers.ObserverEvent.RTL:
					return new MutationObservers.RTL.RTLObserver();
				case Observers.ObserverEvent.Language:
					return new MutationObservers.Lang.LangObserver();
				default:
					throw new Error(`The observer ${observerType} is not supported.`);
			}
		}
	}

	/**
	 * Class to create and store the ObserverManager Class
	 *
	 * @export
	 * @class GlobalObserverManager
	 */
	export class GlobalObserverManager {
		private static _observerManager = new ObserverManager();

		public static get Instance(): ObserverManager {
			return GlobalObserverManager._observerManager;
		}
	}
}
