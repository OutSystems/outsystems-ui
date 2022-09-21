// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.MonthPicker.Callbacks {
	export type OSOnSelectedEvent = {
		(monthPickerId: string, selectedMonth: string, selectedYear: number): void;
	};
}
