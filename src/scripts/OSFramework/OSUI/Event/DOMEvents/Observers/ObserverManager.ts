// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	export class ObserverManager extends AbstractEventsManager<unknown, string> {
		protected getInstanceOfEventType(observerType: Observers.ObserverEvent): Observers.IObserver<unknown, unknown> {
			switch (observerType) {
				case Observers.ObserverEvent.RTL:
					return new MutationObservers.RTL.RTLObserver();
				default:
					throw new Error(`The observer ${observerType} is not supported.`);
			}
		}
	}

	export class GlobalObserverManager {
		private static _observerManager = new ObserverManager();

		public static get Instance(): ObserverManager {
			return GlobalObserverManager._observerManager;
		}
	}
}
