// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DatePicker {
	export abstract class AbstractDatePicker<P, C extends AbstractDatePickerConfig>
		extends AbstractProviderPattern<P, C>
		implements IDatePicker
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Common methods that all DatePickers must implement!
		public abstract clear(): void;
		public abstract close(): void;
		public abstract disableDays(value: string[]): void;
		public abstract disableWeekDays(value: number[]): void;
		public abstract onRender(): void;
		public abstract open(): void;
		public abstract setLanguage(value: string): void;
		public abstract updateInitialDate(date1: string, date2?: string): void;
		public abstract updatePrompt(promptMessage: string): void;
	}
}
