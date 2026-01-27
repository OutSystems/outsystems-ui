// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.Lang {
	/**
	 * MutationObserver Configs for the Lang Observer
	 *
	 * @export
	 * @class LangObserverConfigs
	 * @implements {MutationObserverInit}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class LangObserverConfigs implements MutationObserverInit {
		public attributeFilter: Array<string>;

		constructor() {
			this.attributeFilter = [GlobalEnum.HTMLAttributes.Lang];
		}
	}
}
