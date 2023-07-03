// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers {
	/**
	 * Abstract MutionObserver Class, to hadle all code common for all types of Mutation Observers
	 *
	 * @export
	 * @abstract
	 * @class AbstractMutationObserver
	 * @extends {AbstractObserver<MutationObserverInit>}
	 * @implements {IObserver<MutationObserverInit, string>}
	 */
	export abstract class AbstractMutationObserver
		extends AbstractObserver<MutationObserverInit>
		implements IObserver<MutationObserverInit, string>
	{
		constructor(observerOptions: MutationObserverInit, observerTarget: HTMLElement) {
			super(observerOptions, observerTarget);
			this.addEvent();
			this.startObserver();
		}

		/**
		 * Method to add a new MutationObserver
		 *
		 * @memberof AbstractMutationObserver
		 */
		public addEvent(): void {
			this.observer = new MutationObserver(this.observerHandler.bind(this));
		}

		/**
		 * Mandatory implementation for the observer handler
		 *
		 * @protected
		 * @abstract
		 * @param {MutationRecord[]} mutationList
		 * @memberof AbstractMutationObserver
		 */
		protected abstract observerHandler(mutationList: MutationRecord[]): void;
	}
}
