// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RangeSliderAPI {
	const _rangeSliderItemsMap = new Map<string, OSUIFramework.Patterns.RangeSlider.IRangeSlider>(); //RangeSlider.uniqueId -> RangeSlider obj

	/**
	 * Function that will change the property of a given RangeSlider Id.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(rangeSliderId: string, propertyName: string, propertyValue: unknown): void {
		const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

		_rangeSliderItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new RangeSliderItem instance and add it to the rangeSliderItemsMap
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Create(
		rangeSliderId: string,
		configs: string,
		provider: string //TODO: change the order of parameters in OutSystems code
	): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		if (_rangeSliderItemsMap.has(rangeSliderId)) {
			throw new Error(
				`There is already an ${OSUIFramework.GlobalEnum.PatternsNames.RangeSlider} registered under id: ${rangeSliderId}`
			);
		}

		const _rangeSliderItem = OSUIFramework.Patterns.RangeSlider.Factory.NewRangeSlider(
			rangeSliderId,
			provider,
			configs
		);

		_rangeSliderItemsMap.set(rangeSliderId, _rangeSliderItem);

		return _rangeSliderItem;
	}

	/**
	 * Function that will dispose the instance of the given RangeSliderItem Id
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function Dispose(rangeSliderId: string): void {
		const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

		_rangeSliderItem.dispose();

		_rangeSliderItemsMap.delete(_rangeSliderItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the RangeSlider instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllRangeSliderItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_rangeSliderItemsMap);
	}

	/**
	 * Function that gets the instance of RangeSlider, by a given ID.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.RangeSlider.IRangeSlider;}
	 */
	export function GetRangeSliderItemById(rangeSliderId: string): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			OSUIFramework.GlobalEnum.PatternsNames.RangeSlider,
			rangeSliderId,
			_rangeSliderItemsMap
		) as OSUIFramework.Patterns.RangeSlider.IRangeSlider;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSliderItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Initialize(rangeSliderId: string): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

		_rangeSliderItem.build();

		return _rangeSliderItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterProviderCallback(
		rangeSliderId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): void {
		const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

		rangeSlider.registerProviderCallback(eventName, callback);
	}

	/**
	 * Function to change the Range Slider trigger to on DragEnd
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function SetRangeIntervalChangeOnDragEnd(rangeSliderId: string): void {
		const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

		rangeSlider.setRangeIntervalChangeOnDragEnd();
	}
}
