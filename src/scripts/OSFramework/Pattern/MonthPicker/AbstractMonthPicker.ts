// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.MonthPicker {
	export abstract class AbstractMonthPicker<P, C extends AbstractMonthPickerConfig>
		extends AbstractProviderPattern<P, C>
		implements IMonthPicker
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public abstract clear(): void;
		public abstract close(): void;
		public abstract open(): void;
		public abstract setLanguage(value: string): void;
	}
}
