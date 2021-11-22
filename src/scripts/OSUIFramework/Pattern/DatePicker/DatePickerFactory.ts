/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.DatePicker.Factory {
	/**
	 * Create the new DatePicker instance object according given provider
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IDatePicker}
	 */
	export function NewDatePicker(
		datePickerId: string,
		configs: string,
		provider: string
	): OSUIFramework.Patterns.DatePicker.IDatePicker {
		let _datePickerItem = null;

		switch (provider) {
			case Enum.Provider.FlatPicker:
				_datePickerItem = Providers.Flatpickr.Factory.NewFlatpickr(datePickerId, configs);

				break;

			default:
				throw new Error(`There is no ${GlobalEnum.PatternsNames.Datepicker} of the ${provider} provider`);
		}

		return _datePickerItem;
	}
}
