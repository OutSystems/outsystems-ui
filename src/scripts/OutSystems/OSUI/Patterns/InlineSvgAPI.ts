// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.InlineSvgAPI {
	const _inlineSvgMap = new Map<string, OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg>();
	/**
	 * Function that will change the property of a given InlineSvg.
	 *
	 * @export
	 * @param {string} inlineSvgId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	export function ChangeProperty(inlineSvgId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.InlineSvg.FailChangeProperty,
			callback: () => {
				const inlineSvg = GetInlineSvgById(inlineSvgId);

				inlineSvg.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new InlineSvg instance and add it to the InlineSvgsMap
	 *
	 * @export
	 * @param {string} inlineSvgId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg}
	 */
	export function Create(inlineSvgId: string, configs: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg {
		if (_inlineSvgMap.has(inlineSvgId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.InlineSvg} registered under id: ${inlineSvgId}`
			);
		}

		const _newInlineSvg = new OSFramework.OSUI.Patterns.InlineSvg.InlineSvg(inlineSvgId, JSON.parse(configs));
		_inlineSvgMap.set(inlineSvgId, _newInlineSvg);
		return _newInlineSvg;
	}

	/**
	 * Function that will destroy the instance of the given InlineSvg
	 *
	 * @export
	 * @param {string} inlineSvgId
	 */
	export function Dispose(inlineSvgId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.InlineSvg.FailDispose,
			callback: () => {
				const inlineSvg = GetInlineSvgById(inlineSvgId);

				inlineSvg.dispose();

				_inlineSvgMap.delete(inlineSvgId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the InlineSvg instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllInlineSvgs(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_inlineSvgMap);
	}

	/**
	 * Function that gets the instance of InlineSvg, by a given ID.
	 *
	 * @export
	 * @param {string} inlineSvgId
	 * @return {*}  {OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg}
	 */
	export function GetInlineSvgById(inlineSvgId: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'InlineSvg',
			inlineSvgId,
			_inlineSvgMap
		) as OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} inlineSvgId
	 * @return {*}  {OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg}
	 */
	export function Initialize(inlineSvgId: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg {
		const inlineSvg = GetInlineSvgById(inlineSvgId);

		inlineSvg.build();

		return inlineSvg;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} inlineSvgId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		inlineSvgId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.InlineSvg.FailRegisterCallback,
			callback: () => {
				const _InlineSvgItem = this.GetInlineSvgById(inlineSvgId);

				_InlineSvgItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
