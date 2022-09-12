// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.MonthPicker.Callbacks {
	export type OSOnSelectedEvent = {
		(timepickerId: string, selectedMonth: MonthYear): void;
	};
}
