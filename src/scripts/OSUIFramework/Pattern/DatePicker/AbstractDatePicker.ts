// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePicker<C extends AbstractDatePickerConfig>
		extends AbstractPattern<C>
		implements IDatePicker
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public build(): void {
			super.build();
		}

		public abstract clear(): void;
		public abstract close(): void;
		public abstract open(): void;
	}
}
