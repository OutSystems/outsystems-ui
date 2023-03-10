/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Datepicker.Flatpickr.Factory {
	/**
	 * Create the new Flatpickr instance object according given Mode
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Progress.IDatePicker}
	 */
	export function NewFlatpickr(
		datePickerId: string,
		mode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode,
		configs: string
	): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		let _flatpickrItem = null;
		let _patternName: string;

		switch (mode) {
			case OSFramework.OSUI.Patterns.DatePicker.Enum.Mode.Single:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.Datepicker;

				break;

			case OSFramework.OSUI.Patterns.DatePicker.Enum.Mode.Range:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.DatepickerRange;

				break;

			default:
				throw new Error(`There is no Flatpickr of ${mode} type`);
		}

		_flatpickrItem = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			_patternName,
			datePickerId,
			JSON.parse(configs),
			OSFramework.OSUI.Patterns.DatePicker.Enum.Provider.FlatPicker
		) as OSFramework.OSUI.Patterns.DatePicker.IDatePicker;

		return _flatpickrItem;
	}
}
