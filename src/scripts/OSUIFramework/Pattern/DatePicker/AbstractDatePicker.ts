// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePicker<P, C extends AbstractDatePickerConfig>
		extends AbstractPattern<C>
		implements IDatePicker, Interface.IProviderPattern<P>
	{
		private _provider: P;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public get provider(): P {
			return this._provider;
		}

		public abstract clear(): void;
		public abstract close(): void;
		public abstract open(): void;
		public abstract registerProviderCallback(eventName: string, callback: Callbacks.OSGeneric): void;
	}
}
