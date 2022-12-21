// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.TimePicker.Flatpickr {
	/**
	 * Defines the interface for Timepicker Pattern Based on Flatpickr provider
	 */
	export interface IFlatpickrTime
		extends OSFramework.Patterns.TimePicker.ITimePicker,
			OSFramework.Interface.IProviderPattern<Flatpickr> {}
}
