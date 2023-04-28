// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class RTLObserver extends AbstractMutationObserver {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _hasAlreadyRTL;

		constructor() {
			super(new RTLObserverConfigs(), document.body);
			this._hasAlreadyRTL = document.body.classList.contains(OSFramework.OSUI.Constants.IsRTLClass);
		}

		public observerHandler(mutationList: MutationRecord[]): void {
			mutationList.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					const mutationTarget = mutation.target as HTMLElement;
					const hasRTLNow = mutationTarget.classList.contains(OSFramework.OSUI.Constants.IsRTLClass);
					if (this._hasAlreadyRTL !== hasRTLNow) {
						this._hasAlreadyRTL = hasRTLNow;
						this.trigger(Observers.ObserverEvent.RTL, mutation);
					}
				}
			});
		}
	}
}
