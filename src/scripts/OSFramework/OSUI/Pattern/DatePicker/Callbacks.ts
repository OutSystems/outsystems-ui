// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DatePicker.Callbacks {
	export type OSOnChangeEvent = {
		(datepickerId: string, selectedDate: string | string[]): void;
	};

	export type OSOnInvalidInputEvent = {
		(datepickerId: string, errorCode: string, inputText: string, reason: string): void;
	};
}
