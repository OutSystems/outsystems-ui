// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns {
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
		protected _providerInfo: ProviderInfo;

		public get providerInfo(): ProviderInfo {
			return this._providerInfo;
		}

		public set providerInfo(providerInfo: ProviderInfo) {
			this._providerInfo = providerInfo;
		}

		public set provider(p: P) {
			this._provider = p;
		}

		public get provider(): P {
			return this._provider;
		}

		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract setProviderConfigs(providerConfigs: RangeSliderProviderConfigs): void;
		public abstract setProviderEvent(eventName: string, callback: GlobalCallbacks.Generic): void;
	}
}
