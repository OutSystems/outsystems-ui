// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Abstract class that will be responsible for the basic behaviours of a link, namely storing the callbacks.
	 *
	 * @export
	 * @abstract
	 * @class AbstractEvent
	 * @implements {IEvent<T>}
	 * @template T
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export abstract class AbstractEvent<T> implements IEvent<T> {
		private _handlers: Callbacks.OSGeneric[] = [];

		protected get handlers(): Callbacks.OSGeneric[] {
			return this._handlers;
		}

		public addHandler(handler: Callbacks.OSGeneric): void {
			this._handlers.push(handler);
		}

		public hasHandlers(): boolean {
			return this._handlers.length > 0;
		}

		public removeHandler(handler: Callbacks.OSGeneric): void {
			const index = this._handlers.findIndex((hd) => {
				return hd === handler;
			});

			if (index !== -1) {
				this._handlers.splice(index, 1);
			}
		}

		// eslint-disable-next-line  @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
		public trigger(data?: T, ...args): void {
			this._handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, data, ...args));
		}
	}
}
