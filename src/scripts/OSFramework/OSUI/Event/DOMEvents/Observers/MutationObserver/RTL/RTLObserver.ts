// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class RTLObserver extends AbstractMutationObserver {
		constructor() {
			super(new RTLObserverConfigs(), document.documentElement);
		}

		public observerHandler(mutationList: MutationRecord[]): void {
			mutationList.forEach((mutation) => {
				switch (mutation.type) {
					case 'attributes':
						switch (mutation.attributeName) {
							case 'lang':
								this.trigger('RTL', mutation);
								break;
						}
						break;
				}
			});
		}
	}
}
