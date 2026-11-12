// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TimePicker.Callbacks {
	export type OSOnChangeEvent = {
		(timepickerId: string, selectedTime: string): void;
	};
}
