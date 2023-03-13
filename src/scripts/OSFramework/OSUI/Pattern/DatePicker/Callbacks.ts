// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DatePicker.Callbacks {
	export type OSOnChangeEvent = {
		(datepickerId: string, selectedDate: string | string[]): void;
	};
}
