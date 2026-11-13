// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr {
	/**
	 * OutSystemsUI Flatpickr Provider
	 */
	export const ErrorCodes = {
		FailSetLocale: 'OSUI-PRO-02001',
		// Typed text that can't be read as a date in the input format (OnInvalidInput)
		InvalidTypedInput: 'OSUI-PRO-02002',
		// Typed date that is disabled (DisabledDays, DisabledWeekDays) (OnInvalidInput)
		DisabledTypedDate: 'OSUI-PRO-02003',
		// Typed date before MinDate or after MaxDate (OnInvalidInput)
		OutOfRangeTypedDate: 'OSUI-PRO-02004',
	};
}
