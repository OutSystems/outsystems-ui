// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider {
	export abstract class AbstractRangeSlider<P, C extends AbstractRangeSliderConfig>
		extends AbstractPattern<C>
		implements IRangeSlider, Interface.IProviderPattern<P>
	{
		private _provider: P;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public get provider(): P {
			return this._provider;
		}

		public set provider(p: P) {
			this._provider = p;
		}

		public abstract registerProviderCallback(eventName: string, callback: Callbacks.OSGeneric): void;
		public abstract setRangeIntervalChangeOnDragEnd(): void;
	}
}
