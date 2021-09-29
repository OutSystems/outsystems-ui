// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FlipContentAPI {
	const _flipMap = new Map<string, OSUIFramework.Patterns.FlipContent.IFlipContent>(); //flipContent.uniqueId -> FlipContent obj

	/**
	 * Function that will change the property of a flip content pattern.
	 *
	 * @export
	 * @param {string} flipID ID of the Tooltip where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(flipId: string, propertyName: string, propertyValue: any): void {
		const flipContent = GetFlipContentById(flipId);

		flipContent.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new flip content instance and add it to flipMap
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content where the instance will be created.
	 * @param {string} configs configurations for the Flip Content in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.ITooltip}
	 */
	export function Create(flipId: string, configs: string): OSUIFramework.Patterns.FlipContent.IFlipContent {
		if (_flipMap.has(flipId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.FlipContent} registered under id: ${flipId}`
			);
		}

		const _newFlip = new OSUIFramework.Patterns.FlipContent.FlipContent(flipId, JSON.parse(configs));

		_flipMap.set(flipId, _newFlip);

		return _newFlip;
	}

	/**
	 * Function that will destroy the instance of the given Flip Content
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function Destroy(flipId: string): void {
		const flipContent = GetFlipContentById(flipId);

		flipContent.dispose();

		_flipMap.delete(flipContent.uniqueId);
	}

	/**
	 * Function that will return the Map with all the Flip Content instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.FlipContent.IFlipContent>}
	 */
	export function GetAllFlipContent(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_flipMap);
	}

	/**
	 * Function that gets the instance of flip content, by a given ID.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.FlipContent.IFlipContent}
	 */
	export function GetFlipContentById(flipId: string): OSUIFramework.Patterns.FlipContent.IFlipContent {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'FlipContent',
			flipId,
			_flipMap
		) as OSUIFramework.Patterns.FlipContent.IFlipContent;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.FlipContent.IFlipContent}
	 */
	export function Initialize(flipId: string): OSUIFramework.Patterns.FlipContent.IFlipContent {
		const flipContent = GetFlipContentById(flipId);

		flipContent.build();

		return flipContent;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} flipId
	 * @param {OSUIFramework. Callbacks.OSFlipContentFlipEvent} callback
	 */
	export function RegisterCallback(flipId: string, callback: OSUIFramework.Callbacks.OSFlipContentFlipEvent): void {
		const flipContent = GetFlipContentById(flipId);

		flipContent.registerCallback(callback);
	}
}
