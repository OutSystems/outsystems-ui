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
	 * @param {OSUIFramework.Patterns.RangeSlider.Enum.Mode} mode
	 * @param {string} provider
	 * @return {*}  {OSUIFramework.Patterns.RangeSlider.IRangeSlider}
	 */
	export function Create(
		rangeSliderId: string,
		configs: string,
		mode: OSUIFramework.Patterns.RangeSlider.Enum.Mode,
		provider: string
	): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		if (_rangeSliderItemsMap.has(rangeSliderId)) {
			throw new Error(
				`There is already an ${OSUIFramework.GlobalEnum.PatternName.RangeSlider} registered under id: ${rangeSliderId}`
			);
		}

		const _rangeSliderItem = OSUIFramework.Patterns.RangeSlider.Factory.NewRangeSlider(
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
			OSUIFramework.GlobalEnum.PatternName.RangeSlider,
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
	export function RegisterCallback(
		rangeSliderId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
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
}
