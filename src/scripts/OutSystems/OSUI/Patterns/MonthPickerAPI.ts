// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.MonthPickerAPI {
	const _monthPickerItemsMap = new Map<string, OSFramework.Patterns.MonthPicker.IMonthPicker>(); //MonthPicker.uniqueId -> MonthPicker obj

	/**
	 * Function that will change the property of a given MonthPicker Id.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPicker where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(monthPickerId: string, propertyName: string, propertyValue: any): void {
		const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

		_monthPickerItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new MonthPickerItem instance and add it to the monthPickerItemsMap
	 *
	 * @export
	 * @param {string} monthPickerId ID of the Pattern that a new instance will be created.
	 * @param {string} provider Set which provider should be used to create the monthPicker instance.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Create(
		monthPickerId: string,
		provider: string,
		configs: string
	): OSFramework.Patterns.MonthPicker.IMonthPicker {
		if (_monthPickerItemsMap.has(monthPickerId)) {
			/* TODO (by CreateNewPattern): 
				The line below is created by the CreateNewPattern mechanism, that is not able to replace values
				as expected, that said, check other patterns to understand how to replace it!
			*/
			throw new Error('There is already an MonthPicker registered under id: ' + monthPickerId);
		}

		const _monthPickerItem = OSFramework.Patterns.MonthPicker.Factory.NewMonthPicker(
			monthPickerId,
			provider,
			configs
		);

		_monthPickerItemsMap.set(monthPickerId, _monthPickerItem);

		return _monthPickerItem;
	}

	/**
	 * Function that will dispose the instance of the given MonthPickerItem Id
	 *
	 * @export
	 * @param {string} monthPickerId
	 */
	export function Dispose(monthPickerId: string): void {
		const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

		_monthPickerItem.dispose();

		_monthPickerItemsMap.delete(_monthPickerItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the MonthPicker instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllMonthPickerItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_monthPickerItemsMap);
	}

	/**
	 * Function that gets the instance of MonthPicker, by a given ID.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPicker that will be looked for.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker;}
	 */
	export function GetMonthPickerItemById(monthPickerId: string): OSFramework.Patterns.MonthPicker.IMonthPicker {
		return OSFramework.Helper.MapOperation.FindInMap(
			'MonthPicker',
			monthPickerId,
			_monthPickerItemsMap
		) as OSFramework.Patterns.MonthPicker.IMonthPicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Initialize(monthPickerId: string): OSFramework.Patterns.MonthPicker.IMonthPicker {
		const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

		_monthPickerItem.build();

		return _monthPickerItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {string} eventName
	 * @param {OSFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		monthPickerId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): void {
		const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

		_monthPicker.registerCallback(eventName, callback);
	}
}
