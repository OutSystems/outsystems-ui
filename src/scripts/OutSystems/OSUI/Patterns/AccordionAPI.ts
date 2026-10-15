/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.AccordionAPI {
	const _accordionMap = new Map<string, OSFramework.OSUI.Patterns.Accordion.IAccordion>(); //Accordion.uniqueId -> Accordion obj

	/**
	 * Function that will change the property of a given Accordion pattern.
	 *
	 * @param accordionId ID of the Accordion where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(accordionId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Accordion.FailChangeProperty,
			callback: () => {
				const accordion = GetAccordionById(accordionId);
				accordion.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function that will collapse all the expanded items in a given accordion
	 *
	 * @param accordionId ID of the Accordion pattern.
	 *
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function CollapseAllItems(accordionId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Accordion.FailCollapseAll,
			callback: () => {
				const accordion = GetAccordionById(accordionId);
				accordion.collapseAllItems();
			},
		});

		return result;
	}

	/**
	 * Create the new Accordion instance and add it to the AccordionMap
	 *
	 * @param accordionId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the Accordion instance
	 */
	export function Create(
		accordionId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		if (_accordionMap.has(accordionId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Accordion} registered under id: ${accordionId}`
			);
		}

		const _newAccordion = new OSFramework.OSUI.Patterns.Accordion.Accordion(
			accordionId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_accordionMap.set(accordionId, _newAccordion);

		return _newAccordion;
	}

	/**
	 * Function that will dispose the instance of the given Accordion
	 *
	 * @param accordionId The id of the Accordion element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(accordionId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Accordion.FailDispose,
			callback: () => {
				const accordion = GetAccordionById(accordionId);

				accordion.dispose();

				_accordionMap.delete(accordion.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will expand all the collapsed items in a given accordion
	 *
	 * @param accordionId ID of the Accordion pattern.
	 *
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ExpandAllItems(accordionId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Accordion.FailExpandAll,
			callback: () => {
				const accordion = GetAccordionById(accordionId);

				accordion.expandAllItems();
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Accordion instances at the page
	 *
	 * @returns the ids of every Accordion instance
	 */
	export function GetAllAccordions(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_accordionMap);
	}

	/**
	 * Function that gets the instance of an Accordion by a given ID.
	 *
	 * @param accordionId ID of the Accordion that will be looked for.
	 * @returns the Accordion instance
	 */
	export function GetAccordionById(accordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		// Protects the code when you have the pattern of removing children and parents
		// In this case, FloatingActionsItem, when destorying itself, will have a hard time looking for something that has already been disposed.
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Accordion',
			accordionId,
			_accordionMap
		) as OSFramework.OSUI.Patterns.Accordion.IAccordion;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param accordionId ID of the Accordion pattern that will be initialized.
	 * @returns the Accordion instance
	 */
	export function Initialize(accordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		const accordion = GetAccordionById(accordionId);

		accordion.build();

		return accordion;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param accordionId The id of the Accordion element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		accordionId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Accordion.FailRegisterCallback,
			callback: () => {
				const accordion = GetAccordionById(accordionId);

				accordion.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
