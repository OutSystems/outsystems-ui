// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 *
	 * @export
	 * @abstract
	 * @class AbstractPattern
	 * @implements {Interface.IPattern}
	 * @template C
	 */
	export abstract class AbstractProviderPattern<P, C extends AbstractConfiguration>
		extends AbstractPattern<C>
		implements Interface.IProviderPattern<P>
	{
		protected _provider: P;

		public set provider(p: P) {
			this._provider = p;
		}

		public get provider(): P {
			return this._provider;
		}

		public abstract registerProviderCallback(eventName: string, callback: Callbacks.OSGeneric): void;
	}
}
