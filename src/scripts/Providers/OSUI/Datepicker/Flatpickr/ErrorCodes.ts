// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr {
	/**
	 * OutSystemsUI Flatpickr Provider
	 */
	export const ErrorCodes = {
		FailSetLocale: 'OSUI-PRO-02001',
		// Typed text that can't be read as a date in the input format (OnInvalidInput)
		InvalidTypedInput: 'OSUI-PRO-02002',
		// Typed date that the picker doesn't allow: a disabled day, or before MinDate / after MaxDate (OnInvalidInput)
		DisabledTypedDate: 'OSUI-PRO-02003',
	};
}
