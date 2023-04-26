// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.Observer {
	export class ObserverManager extends AbstractObserverManager<unknown, string> {
		protected getInstanceOfEventType(observerType: Observer.ObserverEvent): Observer.IObserver<unknown, unknown> {
			switch (observerType) {
				case Observer.ObserverEvent.RTL:
					return new Event.Observer.RTL.RTLObserver();
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
