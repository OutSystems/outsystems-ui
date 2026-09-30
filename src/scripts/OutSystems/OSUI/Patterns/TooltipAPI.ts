// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TooltipAPI {
	const _tooltipsMap = new Map<string, OSFramework.OSUI.Patterns.Tooltip.ITooltip>(); //tooltip.uniqueId -> Tooltip obj

	/**
	 * Function that will change the property of a given tooltip.
	 *
	 * @param tooltipId ID of the Tooltip where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(tooltipId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tooltip.FailChangeProperty,
			callback: () => {
				const tooltip = GetTooltipById(tooltipId);

				tooltip.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function that will close a given tooltip.
	 *
	 * @param tooltipId ID of the tooltip that will be closed
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Close(tooltipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tooltip.FailClose,
			callback: () => {
				const tooltip = GetTooltipById(tooltipId);

				tooltip.close();
			},
		});

		return result;
	}

	/**
	 * Create the new tooltip instance and add it to the tooltipsMap
	 *
	 * @param tooltipId ID of the Tooltip where the instance will be created.
	 * @param configs configurations for the Tooltip in JSON format.
	 * @returns the Tooltip instance
	 */
	export function Create(tooltipId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Tooltip.ITooltip {
		if (_tooltipsMap.has(tooltipId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Tooltip} registered under id: ${tooltipId}`
			);
		}

		const _newTooltip = new OSFramework.OSUI.Patterns.Tooltip.Tooltip(
			tooltipId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_tooltipsMap.set(tooltipId, _newTooltip);

		return _newTooltip;
	}

	/**
	 * Function that will destroy the instance of the given tooltip
	 *
	 * @param tooltipId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(tooltipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tooltip.FailDispose,
			callback: () => {
				const tooltip = GetTooltipById(tooltipId);

				tooltip.dispose();

				_tooltipsMap.delete(tooltip.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Tooltip instances at the page
	 *
	 * @returns the ids of every Tooltip instance
	 */
	export function GetAllTooltips(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tooltipsMap);
	}

	/**
	 * Function that gets the instance of tooltip, by a given ID.
	 *
	 * @param tooltipId ID of the Tooltip that will be looked for.
	 * @returns the Tooltip instance
	 */
	export function GetTooltipById(tooltipId: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Tooltip,
			tooltipId,
			_tooltipsMap
		) as OSFramework.OSUI.Patterns.Tooltip.ITooltip;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param tooltipId ID of the Tooltip that will be initialized.
	 * @returns the Tooltip instance
	 */
	export function Initialize(tooltipId: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.build();

		return tooltip;
	}

	/**
	 * Fucntion that will open a given tooltip.
	 *
	 * @param tooltipId ID of the tooltip that will be opened
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Open(tooltipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tooltip.FailOpen,
			callback: () => {
				const tooltip = GetTooltipById(tooltipId);

				tooltip.open();
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param tooltipId
	 * @param eventName
	 * @param callback
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		tooltipId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tooltip.FailRegisterCallback,
			callback: () => {
				const tooltip = this.GetTooltipById(tooltipId);

				tooltip.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
