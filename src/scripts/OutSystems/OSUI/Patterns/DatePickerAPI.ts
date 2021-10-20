// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DatePickerAPI {
	const _datePickerItemsMap = new Map<string, OSUIFramework.Patterns.DatePicker.IDatePicker>(); //DatePicker.uniqueId -> DatePicker obj

	/**
	 * Function that will change the property of a given DatePicker Id.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePicker where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(datePickerId: string, propertyName: string, propertyValue: any): void {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new DatePickerItem instance and add it to the datePickerItemsMap
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Create(
		datePickerId: string,
		configs: string,
		provider: string
	): OSUIFramework.Patterns.DatePicker.IDatePicker {
		if (_datePickerItemsMap.has(datePickerId)) {
			throw new Error(`There is already an DatePicker registered under id: ${datePickerId}`);
		}

		const _datePickerItem = OSUIFramework.Patterns.DatePicker.Factory.NewDatePicker(
			datePickerId,
			configs,
			provider
		);

		_datePickerItemsMap.set(datePickerId, _datePickerItem);

		return _datePickerItem;
	}

	/**
	 * Function that will dispose the instance of the given DatePickerItem Id
	 *
	 * @export
	 * @param {string} datePickerId
	 */
	export function Dispose(datePickerId: string): void {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.dispose();

		_datePickerItemsMap.delete(_datePickerItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the DatePicker instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllDatePickerItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_datePickerItemsMap);
	}

	/**
	 * Function that gets the instance of DatePicker, by a given ID.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePicker that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.DatePicker.IDatePicker;}
	 */
	export function GetDatePickerItemById(datePickerId: string): OSUIFramework.Patterns.DatePicker.IDatePicker {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'DatePicker',
			datePickerId,
			_datePickerItemsMap
		) as OSUIFramework.Patterns.DatePicker.IDatePicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Initialize(datePickerId: string): OSUIFramework.Patterns.DatePicker.IDatePicker {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.build();

		return _datePickerItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterProviderCallback(
		datePickerId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): void {
		const _datePicker = this.GetDatePickerItemById(datePickerId);

		_datePicker.registerProviderCallback(eventName, callback);
	}
}
