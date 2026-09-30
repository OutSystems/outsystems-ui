// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.InlineSvgAPI {
	const _inlineSvgMap = new Map<string, OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg>();
	/**
	 * Function that will change the property of a given InlineSvg.
	 *
	 * @param inlineSvgId
	 * @param propertyName
	 * @param propertyValue
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param inlineSvgId
	 * @param configs
	 * @returns the InlineSvg instance
	 */
	export function Create(
		inlineSvgId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg {
		if (_inlineSvgMap.has(inlineSvgId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.InlineSvg} registered under id: ${inlineSvgId}`
			);
		}

		const _newInlineSvg = new OSFramework.OSUI.Patterns.InlineSvg.InlineSvg(
			inlineSvgId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);
		_inlineSvgMap.set(inlineSvgId, _newInlineSvg);
		return _newInlineSvg;
	}

	/**
	 * Function that will destroy the instance of the given InlineSvg
	 *
	 * @param inlineSvgId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every InlineSvg instance
	 */
	export function GetAllInlineSvgs(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_inlineSvgMap);
	}

	/**
	 * Function that gets the instance of InlineSvg, by a given ID.
	 *
	 * @param inlineSvgId
	 * @returns the InlineSvg instance
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
	 * @param inlineSvgId
	 * @returns the InlineSvg instance
	 */
	export function Initialize(inlineSvgId: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg {
		const inlineSvg = GetInlineSvgById(inlineSvgId);

		inlineSvg.build();

		return inlineSvg;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param inlineSvgId
	 * @param eventName
	 * @param callback
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		inlineSvgId: string,
		eventName: EventName,
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

	/**
	 * Function to set the accessibility properties of the InlineSvg
	 *
	 * @param inlineSvgId
	 * @param a11yOptions
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function SetAccessibilityProperties(inlineSvgId: string, a11yOptions: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.InlineSvg.FailSetAccessibilityProperties,
			callback: () => {
				const _InlineSvgItem = this.GetInlineSvgById(inlineSvgId);

				_InlineSvgItem.applyA11YProperties(a11yOptions);
			},
		});

		return result;
	}
}
