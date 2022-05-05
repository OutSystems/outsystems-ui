// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	/**
	 * Defines the interface for OutSystemsUI DatePicker Pattern
	 */
	export interface IDatePicker extends Interface.IPattern {
		clear(): void;
		close(): void;
		open(): void;
		updateInitialDate(date1: string, date2?: string): void;
	}
}
