/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Datepicker.Flatpickr.Factory {
	/**
	 * Create the new Flatpickr instance object according given Mode
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.Progress.IDatePicker}
	 */
	export function NewFlatpickr(
		datePickerId: string,
		mode: OSFramework.Patterns.DatePicker.Enum.Mode,
		configs: string
	): OSFramework.Patterns.DatePicker.IDatePicker {
		let _flatpickrItem = null;

		switch (mode) {
			case OSFramework.Patterns.DatePicker.Enum.Mode.Single:
				_flatpickrItem = new Providers.Datepicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate(
					datePickerId,
					JSON.parse(configs)
				);

				break;

			case OSFramework.Patterns.DatePicker.Enum.Mode.Range:
				_flatpickrItem = new Providers.Datepicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate(
					datePickerId,
					JSON.parse(configs)
				);

				break;

			default:
				throw new Error(`There is no Flatpickr of ${mode} type`);
		}

		return _flatpickrItem;
	}
}
