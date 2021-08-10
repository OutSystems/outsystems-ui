/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 *  Namespace that contains functions responsible for interactions with the tooltip.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns.TooltipAPI {
	export const tooltipsMap = new Map<string, ITooltip>(); //grid.uniqueId -> Tooltip obj

	/**
	 * Create the new tooltip instance and add it to the tooltipsMap
	 *
	 * @export
	 * @param {string} widgetId ID of the Tooltip where the instance will be created.
	 * @param {string} configs configurations for the Tooltip in JSON format.
	 * @return {*}  {ITooltip}
	 */
	export function Create(widgetId: string, configs: string): ITooltip {
		if (tooltipsMap.has(widgetId)) {
			throw new Error(`There is already a tooltip registered under id: ${widgetId}`);
		}

		const _newTooltip = new Tooltip(widgetId, JSON.parse(configs));

		tooltipsMap.set(widgetId, _newTooltip);

		return _newTooltip;
	}

	/**
	 * Function that gets the instance of tooltip, by a given ID.
	 *
	 * @export
	 * @param {string} widgetId ID of the Tooltip that will be looked for.
	 * @return {*}  {ITooltip}
	 */
	export function GetGridById(widgetId: string): ITooltip {
		let tooltip: ITooltip;

		//gridID is the UniqueId
		if (tooltipsMap.has(widgetId)) {
			tooltip = tooltipsMap.get(widgetId);
		} else {
			//Search for WidgetId
			for (const p of tooltipsMap.values()) {
				if (p.equalsToID(widgetId)) {
					tooltip = p;
					break;
				}
			}
		}

		if (tooltip === undefined) {
			throw new Error(`Grid id:${widgetId} not found`);
		}

		return tooltip;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} widgetId ID of the Tooltip that will be initialized.
	 * @return {*}  {ITooltip}
	 */
	export function InitializeGrid(widgetId: string): ITooltip {
		const tooltip = GetGridById(widgetId);

		tooltip.build();

		return tooltip;
	}
}
