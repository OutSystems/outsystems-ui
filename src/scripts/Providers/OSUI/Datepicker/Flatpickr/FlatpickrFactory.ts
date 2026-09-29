/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Datepicker.Flatpickr.Factory {
	/**
	 * Create the new Flatpickr instance object according given Mode
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {(string | Record<string, unknown>)} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Progress.IDatePicker}
	 */
	export function NewFlatpickr(
		datePickerId: string,
		mode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode,
		configs: string | Record<string, unknown>
	): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		let _flatpickrItem = null;

		switch (mode) {
			case OSFramework.OSUI.Patterns.DatePicker.Enum.Mode.Single:
				_flatpickrItem = new Providers.OSUI.Datepicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate(
					datePickerId,
					OSFramework.OSUI.Helper.ParseConfigs(configs)
				);

				break;

			case OSFramework.OSUI.Patterns.DatePicker.Enum.Mode.Range:
				_flatpickrItem = new Providers.OSUI.Datepicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate(
					datePickerId,
					OSFramework.OSUI.Helper.ParseConfigs(configs)
				);

				break;

			default:
				throw new Error(`There is no Flatpickr of ${mode} type`);
		}

		return _flatpickrItem;
	}
}
