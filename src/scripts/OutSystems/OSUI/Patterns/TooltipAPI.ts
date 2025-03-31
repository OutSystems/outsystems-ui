// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TooltipAPI {
	const _tooltipsMap = new Map<string, OSFramework.OSUI.Patterns.Tooltip.ITooltip>(); //tooltip.uniqueId -> Tooltip obj

	/**
	 * Function that will change the property of a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} tooltipId ID of the tooltip that will be closed
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
	 * @export
	 * @param {string} tooltipId ID of the Tooltip where the instance will be created.
	 * @param {string} configs configurations for the Tooltip in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.ITooltip}
	 */
	export function Create(tooltipId: string, configs: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip {
		if (_tooltipsMap.has(tooltipId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Tooltip} registered under id: ${tooltipId}`
			);
		}

		const _newTooltip = new OSFramework.OSUI.Patterns.Tooltip.Tooltip(tooltipId, JSON.parse(configs));

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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.ITooltip>}
	 */
	export function GetAllTooltips(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tooltipsMap);
	}

	/**
	 * Function that gets the instance of tooltip, by a given ID.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.ITooltip}
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
	 * @export
	 * @param {string} tooltipId ID of the Tooltip that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.ITooltip}
	 */
	export function Initialize(tooltipId: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip {
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
	 * @export
	 * @param {string} tooltipId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		tooltipId: string,
		eventName: string,
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
