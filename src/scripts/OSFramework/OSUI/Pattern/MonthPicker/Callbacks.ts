// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.MonthPicker.Callbacks {
	export type OSOnSelectedEvent = {
		(monthPickerId: string, selectedMonth: string, monthOrder: number, selectedYear: number): void;
	};

	export type OSOnInvalidInputEvent = {
		(monthPickerId: string, errorCode: string, inputText: string, reason: string): void;
	};
}
