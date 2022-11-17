// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * Abstract class that will be responsible for the basic behaviours of a link, namely storing the callbacks.
	 *
	 * @export
	 * @abstract
	 * @class AbstractEvent
	 * @implements {IEvent<T>}
	 * @template T
	 */
	export abstract class AbstractEvent<T> implements IEvent<T> {
		private _handlers: GlobalCallbacks.OSGeneric[] = [];

		protected get handlers(): GlobalCallbacks.OSGeneric[] {
			return this._handlers;
		}

		public addHandler(handler: GlobalCallbacks.OSGeneric): void {
			this._handlers.push(handler);
		}

		public hasHandlers(): boolean {
			return this._handlers.length > 0;
		}

		public removeHandler(handler: GlobalCallbacks.OSGeneric): void {
			const index = this._handlers.findIndex((hd) => {
				return hd === handler;
			});

			if (index !== -1) {
				this._handlers.splice(index, 1);
			}
		}

		public trigger(data?: T, ...args: unknown[]): void {
			this._handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, data, ...args));
		}
	}
}
