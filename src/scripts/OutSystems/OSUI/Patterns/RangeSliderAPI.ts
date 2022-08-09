// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.RangeSliderAPI {
	const _rangeSliderItemsMap = new Map<string, OSFramework.Patterns.RangeSlider.IRangeSlider>(); //RangeSlider.uniqueId -> RangeSlider obj

	/**
	 * Function that will change the property of a given RangeSlider Id.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(rangeSliderId: string, propertyName: string, propertyValue: unknown): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

			_rangeSliderItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new RangeSliderItem instance and add it to the rangeSliderItemsMap
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} configs
	 * @param {OSFramework.Patterns.RangeSlider.Enum.Mode} mode
	 * @param {string} provider
	 * @return {*}  {OSFramework.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Create(
		rangeSliderId: string,
		configs: string,
		mode: OSFramework.Patterns.RangeSlider.Enum.Mode,
		provider: string
	): OSFramework.Patterns.RangeSlider.IRangeSlider {
		if (_rangeSliderItemsMap.has(rangeSliderId)) {
			throw new Error(
				`There is already an ${OSFramework.GlobalEnum.PatternName.RangeSlider} registered under id: ${rangeSliderId}`
			);
		}

		const _rangeSliderItem = OSFramework.Patterns.RangeSlider.Factory.NewRangeSlider(
			rangeSliderId,
			configs,
			mode,
			provider
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
	export function Dispose(rangeSliderId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _rangeSliderItem = GetRangeSliderItemById(rangeSliderId);

			_rangeSliderItem.dispose();

			_rangeSliderItemsMap.delete(_rangeSliderItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the RangeSlider instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllRangeSliderItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_rangeSliderItemsMap);
	}

	/**
	 * Function that gets the instance of RangeSlider, by a given ID.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSlider that will be looked for.
	 * @return {*}  {OSFramework.Patterns.RangeSlider.IRangeSlider;}
	 */
	export function GetRangeSliderItemById(rangeSliderId: string): OSFramework.Patterns.RangeSlider.IRangeSlider {
		return OSFramework.Helper.MapOperation.FindInMap(
			OSFramework.GlobalEnum.PatternName.RangeSlider,
			rangeSliderId,
			_rangeSliderItemsMap
		) as OSFramework.Patterns.RangeSlider.IRangeSlider;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the RangeSliderItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Initialize(rangeSliderId: string): OSFramework.Patterns.RangeSlider.IRangeSlider {
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
	 * @param {OSFramework.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		rangeSliderId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

			rangeSlider.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to change the Range Slider trigger to on DragEnd
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function SetRangeIntervalChangeOnDragEnd(rangeSliderId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);

			rangeSlider.setRangeIntervalChangeOnDragEnd();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailOnDragEnd;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to set the Range Slider value
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {number} value
	 */
	export function SetRangeSliderValue(rangeSliderId: string, valueFrom: number, valueTo?: number): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);
			rangeSlider.setValue(valueFrom, valueTo);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailSetValues;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to reset the Range Slider
	 *
	 * @export
	 * @param {string} rangeSliderId
	 */
	export function ResetRangeSliderValue(rangeSliderId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = this.GetRangeSliderItemById(rangeSliderId);
			rangeSlider.resetValue();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailResetValues;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} rangeSliderId
	 * @param {string} eventName
	 * @param {OSFramework.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function SetProviderEvent(
		rangeSliderId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.Generic
	): string {
		const _eventUniqueId = OSFramework.Helper.Dom.GenerateUniqueId();

		const responseObj = {
			uniqueId: _eventUniqueId,
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = GetRangeSliderItemById(rangeSliderId);
			rangeSlider.setProviderEvent(eventName, callback, _eventUniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailRegisterProviderEvent;
			responseObj.uniqueId = undefined;
		}

		return JSON.stringify(responseObj);
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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const rangeSlider = GetRangeSliderItemById(rangeSliderId);
			rangeSlider.unsetProviderEvent(eventId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.RangeSlider.FailRemoveProviderEvent;
		}

		return JSON.stringify(responseObj);
	}
}
