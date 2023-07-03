/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.TimePicker.Factory {
	/**
	 * Create the new TimePicker instance object according given provider
	 *
	 * @export
	 * @param {string} timePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {Patterns.Progress.ITimePicker}
	 */
	export function NewTimePicker(
		timePickerId: string,
		configs: string,
		provider: string
	): Patterns.TimePicker.ITimePicker {
		let _timePickerItem = null;

		if (provider === Enum.Provider.FlatPicker) {
			_timePickerItem = new Providers.OSUI.TimePicker.Flatpickr.OSUIFlatpickrTime(
				timePickerId,
				JSON.parse(configs)
			);
		} else {
			throw new Error(`There is no ${GlobalEnum.PatternName.Timepicker} of the ${provider} provider`);
		}

		return _timePickerItem;
	}
}
