// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TooltipAPI {
	const tooltipsMap = new Map<string, OSUIFramework.Patterns.Tooltip.ITooltip>(); //tooltip.uniqueId -> Tooltip obj

	/**
	 * Function that will change the property of a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(tooltipId: string, propertyName: string, propertyValue: any): void {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Fucntion that will close a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the tooltip that will be closed
	 */
	export function Close(tooltipId: string): void {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.close();
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
		if (tooltipsMap.has(tooltipId)) {
			throw new Error(`There is already a tooltip registered under id: ${tooltipId}`);
		}

		const _newTooltip = new OSUIFramework.Patterns.Tooltip.Tooltip(tooltipId, JSON.parse(configs));

		tooltipsMap.set(tooltipId, _newTooltip);

		return _newTooltip;
	}

	/**
	 * Function that will destroy the instance of the given tooltip
	 *
	 * @export
	 * @param {string} tooltipId
	 */
	export function Destroy(tooltipId: string): void {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.destroy();

		tooltipsMap.delete(tooltip.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Tooltip instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.ITooltip>}
	 */
	export function GetAllTooltipsMap(): Map<string, OSUIFramework.Patterns.Tooltip.ITooltip> {
		return tooltipsMap;
	}

	/**
	 * Function that gets the instance of tooltip, by a given ID.
	 *
	 * @export
	 * @param {string} tooltipId ID of the Tooltip that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.ITooltip}
	 */
	export function GetTooltipById(tooltipId: string): OSUIFramework.Patterns.Tooltip.ITooltip {
		let tooltip: OSUIFramework.Patterns.Tooltip.ITooltip;

		//tooltipId is the UniqueId
		if (tooltipsMap.has(tooltipId)) {
			tooltip = tooltipsMap.get(tooltipId);
		} else {
			//Search for tooltipId
			for (const p of tooltipsMap.values()) {
				if (p.equalsToID(tooltipId)) {
					tooltip = p;
					break;
				}
			}
		}

		if (tooltip === undefined) {
			throw new Error(`Tooltip id:${tooltipId} not found`);
		}

		return tooltip;
	}

	/**
	 * Fucntion that will open a given tooltip.
	 *
	 * @export
	 * @param {string} tooltipId ID of the tooltip that will be opened
	 */
	export function Open(tooltipId: string): void {
		const tooltip = GetTooltipById(tooltipId);

		tooltip.open();
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
}
