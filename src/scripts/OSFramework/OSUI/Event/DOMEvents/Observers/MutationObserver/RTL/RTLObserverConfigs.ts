// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
	/**
	 * MutationObserver Configs for the RTL Observer
	 *
	 * @export
	 * @class RTLObserverConfigs
	 * @implements {MutationObserverInit}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class RTLObserverConfigs implements MutationObserverInit {
		public attributeFilter: Array<string>;
		public attributeOldValue: boolean;
		public subtree: boolean;

		constructor() {
			this.attributeFilter = [GlobalEnum.HTMLAttributes.Class];
			this.attributeOldValue = true;
			this.subtree = false;
		}
	}
}
