/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.Factory {
	/**
	 * Create the new Flatpickr instance object according given Mode
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IDatePicker}
	 */
	export function NewFlatpickr(datePickerId: string, configs: string): OSUIFramework.Patterns.DatePicker.IDatePicker {
		let _flatpickrItem = null;
		const _flatpickrMode = JSON.parse(configs)[Enum.Properties.Type];

		switch (_flatpickrMode) {
			case Enum.Type.Single:
				_flatpickrItem = new Providers.Flatpickr.SingleDate.OSUIFlatpickrSingleDate(
					datePickerId,
					JSON.parse(configs)
				);

				break;

			case Enum.Type.Range:
				console.log(`Create Flatpickr ${_flatpickrMode} mode`);

				break;

			default:
				throw new Error(`There is no Flatpickr of ${_flatpickrMode} type`);
				break;
		}

		return _flatpickrItem;
	}
}
