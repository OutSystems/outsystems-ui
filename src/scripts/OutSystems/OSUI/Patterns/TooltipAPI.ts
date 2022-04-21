// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TooltipAPI {
	const _tooltipsMap = new Map<string, OSUIFramework.Patterns.Tooltip.ITooltip>(); //tooltip.uniqueId -> Tooltip obj

	/**
	 * Function that will change the property of a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(tooltipId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const tooltip = GetTooltipById(tooltipId);

		try {
			tooltip.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tooltip.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will close a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the tooltip that will be closed
	 */
	export function Close(tooltipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const tooltip = GetTooltipById(tooltipId);

		try {
			tooltip.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tooltip.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new tooltip instance and add it to the tooltipsMap
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip where the instance will be created.
	 * @param {string} configs configurations for the Tooltip in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.ITooltip}
	 */
	export function Create(tooltipId: string, configs: string): OSUIFramework.Patterns.Tooltip.ITooltip {
		if (_tooltipsMap.has(tooltipId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Tooltip} registered under id: ${tooltipId}`
			);
		}

		const _newTooltip = new OSUIFramework.Patterns.Tooltip.Tooltip(tooltipId, JSON.parse(configs));

		_tooltipsMap.set(tooltipId, _newTooltip);

		return _newTooltip;
	}

	/**
	 * Function that will destroy the instance of the given tooltip
	 *
	 * @export
	 * @param {string} tooltipId
	 */
	export function Dispose(tooltipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const tooltip = GetTooltipById(tooltipId);

		try {
			tooltip.dispose();

			_tooltipsMap.delete(tooltip.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tooltip.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the Tooltip instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.ITooltip>}
	 */
	export function GetAllTooltips(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_tooltipsMap);
	}

	/**
	 * Function that gets the instance of tooltip, by a given ID.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.ITooltip}
	 */
	export function GetTooltipById(tooltipId: string): OSUIFramework.Patterns.Tooltip.ITooltip {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			OSUIFramework.GlobalEnum.PatternsNames.Tooltip,
			tooltipId,
			_tooltipsMap
		) as OSUIFramework.Patterns.Tooltip.ITooltip;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.ITooltip}
	 */
	export function Initialize(tooltipId: string): OSUIFramework.Patterns.Tooltip.ITooltip {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.build();

		return tooltip;
	}

	/**
	 * Fucntion that will open a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the tooltip that will be opened
	 */
	export function Open(tooltipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		const tooltip = GetTooltipById(tooltipId);

		try {
			tooltip.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tooltip.FailOpen;
		}

		return JSON.stringify(responseObj);
	}
}
