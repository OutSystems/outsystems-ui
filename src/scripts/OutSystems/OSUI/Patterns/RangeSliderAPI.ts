// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RangeSliderAPI {
	const _rangeSliderItemsMap = new Map<string, OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider>(); //RangeSlider.uniqueId -> RangeSlider obj

	/**
	 * Function that will change the property of a given RangeSlider Id.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(rangeSliderId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailChangeProperty,
			callback: () => {
				const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

				_rangeSliderItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new RangeSliderItem instance and add it to the rangeSliderItemsMap
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} configs
	 * @param {OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode} mode
	 * @param {string} provider
	 * @return {*}  {OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Create(
		rangeSliderId: string,
		configs: string,
		mode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode,
		provider: string
	): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider {
		if (_rangeSliderItemsMap.has(rangeSliderId)) {
			throw new Error(
				`There is already an ${OSFramework.OSUI.GlobalEnum.PatternName.RangeSlider} registered under id: ${rangeSliderId}`
			);
		}

		const _rangeSliderItem = OSFramework.OSUI.Patterns.RangeSlider.Factory.NewRangeSlider(
			rangeSliderId,
			configs,
			mode,
			provider
		);

		_rangeSliderItemsMap.set(rangeSliderId, _rangeSliderItem);

		return _rangeSliderItem;
	}

	/**
	 * Function that will set RangeSlider with given ID as disabled
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function Disable(rangeSliderId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailDisable,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

				rangeSlider.disable();
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given RangeSliderItem Id
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function Dispose(rangeSliderId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailDispose,
			callback: () => {
				const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

				_rangeSliderItem.dispose();

				_rangeSliderItemsMap.delete(_rangeSliderItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will set RangeSlider with given ID as enabled
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function Enable(rangeSliderId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailEnable,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

				rangeSlider.enable();
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the RangeSlider instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllRangeSliderItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_rangeSliderItemsMap);
	}

	/**
	 * Function that gets the instance of RangeSlider, by a given ID.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;}
	 */
	export function GetRangeSliderItemById(rangeSliderId: string): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.RangeSlider,
			rangeSliderId,
			_rangeSliderItemsMap
		) as OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSliderItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Initialize(rangeSliderId: string): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider {
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
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		rangeSliderId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailRegisterCallback,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

				rangeSlider.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to change the Range Slider trigger to on DragEnd
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function SetRangeIntervalChangeOnDragEnd(rangeSliderId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailOnDragEnd,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

				rangeSlider.setRangeIntervalChangeOnDragEnd();
			},
		});

		return result;
	}

	/**
	 * Function to set the Range Slider value
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {number} value
	 */
	export function SetRangeSliderValue(rangeSliderId: string, valueFrom: number, valueTo?: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailSetValues,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);
				rangeSlider.setValue(valueFrom, valueTo);
			},
		});

		return result;
	}

	/**
	 * Function to reset the Range Slider
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function ResetRangeSliderValue(rangeSliderId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailResetValues,
			callback: () => {
				const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);
				rangeSlider.resetValue();
			},
		});

		return result;
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {RangeSliderProviderConfigs} providerConfigs
	 * @return {*}  {string}
	 */
	export function SetProviderConfigs(rangeSliderId: string, configs: RangeSliderProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailRegisterProviderConfig,
			callback: () => {
				const rangeSlider = GetRangeSliderItemById(rangeSliderId);

				rangeSlider.setProviderConfigs(configs);
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function SetProviderEvent(
		rangeSliderId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();
				const rangeSlider = GetRangeSliderItemById(rangeSliderId);
				rangeSlider.setProviderEvent(eventName, callback, _eventUniqueId);

				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} eventId
	 * @return {*}  {string}
	 */
	export function UnsetProviderEvent(rangeSliderId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.RangeSlider.FailRemoveProviderEvent,
			callback: () => {
				const rangeSlider = GetRangeSliderItemById(rangeSliderId);
				rangeSlider.unsetProviderEvent(eventId);
			},
		});

		return result;
	}
}
