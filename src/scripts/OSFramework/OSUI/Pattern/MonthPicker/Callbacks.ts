// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.MonthPicker.Callbacks {
	export type OSOnSelectedEvent = {
		(monthPickerId: string, selectedMonth: string, monthOrder: number, selectedYear: number): void;
	};
}
