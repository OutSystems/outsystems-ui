// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class RTLObserver extends AbstractMutationObserver {
		// Store if the target has the class is-rtl, for later comparison
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _hasAlreadyRTL;

		constructor() {
			super(new RTLObserverConfigs(), document.body);
			// Check initial status of the rtl on the screen
			this._hasAlreadyRTL = document.body.classList.contains(OSFramework.OSUI.Constants.IsRTLClass);
		}

		/**
		 * Observer callback method
		 *
		 * @param {MutationRecord[]} mutationList
		 * @memberof RTLObserver
		 */
		public observerHandler(mutationList: MutationRecord[]): void {
			mutationList.forEach((mutation) => {
				// Check if mutation was on the Class attribute
				if (mutation.attributeName === GlobalEnum.HTMLAttributes.Class) {
					const mutationTarget = mutation.target as HTMLElement;
					// Check if the mutation was on the is-rtl class
					const hasRTLNow = mutationTarget.classList.contains(OSFramework.OSUI.Constants.IsRTLClass);
					// Check if the rtl status changes
					if (this._hasAlreadyRTL !== hasRTLNow) {
						this._hasAlreadyRTL = hasRTLNow;
						// Trigger all handlers stored
						this.trigger(Observers.ObserverEvent.RTL, mutation);
					}
				}
			});
		}
	}
}
