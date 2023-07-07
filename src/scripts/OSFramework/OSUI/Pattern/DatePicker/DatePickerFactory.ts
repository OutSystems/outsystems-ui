/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.DatePicker.Factory {
	/**
	 * Create the new DatePicker instance object according given provider
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {Patterns.Progress.IDatePicker}
	 */
	export function NewDatePicker(
		datePickerId: string,
		configs: string,
		mode: Enum.Mode,
		provider: string
	): Patterns.DatePicker.IDatePicker {
		let _datePickerItem = null;

		switch (provider) {
			case Enum.Provider.FlatPicker:
				_datePickerItem = Providers.OSUI.Datepicker.Flatpickr.Factory.NewFlatpickr(datePickerId, mode, configs);

				break;

			default:
				throw new Error(`There is no ${GlobalEnum.PatternName.Datepicker} of the ${provider} provider`);
		}

		return _datePickerItem;
	}
}
