/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.AccordionAPI {
	const _accordionMap = new Map<string, OSFramework.OSUI.Patterns.Accordion.IAccordion>(); //Accordion.uniqueId -> Accordion obj

	/**
	 * Function that will change the property of a given Accordion pattern.
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern.
	 *
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
	 * @export
	 * @param {string} accordionId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Accordion.IAccordion}
	 */
	export function Create(accordionId: string, configs: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		if (_accordionMap.has(accordionId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Accordion} registered under id: ${accordionId}`
			);
		}

		const _newAccordion = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			OSFramework.OSUI.GlobalEnum.PatternName.Accordion,
			accordionId,
			JSON.parse(configs)
		) as OSFramework.OSUI.Patterns.Accordion.IAccordion;

		_accordionMap.set(accordionId, _newAccordion);

		return _newAccordion;
	}

	/**
	 * Function that will dispose the instance of the given Accordion
	 *
	 * @export
	 * @param {string} accordionId
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
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern.
	 *
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.Accordion.IAccordion>}
	 */
	export function GetAllAccordions(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_accordionMap);
	}

	/**
	 * Function that gets the instance of an Accordion by a given ID.
	 *
	 * @export
	 * @param {string} AccordionId ID of the Accordion that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Accordion.IAccordion}
	 */
	export function GetAccordionById(AccordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		// Protects the code when you have the pattern of removing children and parents
		// In this case, FloatingActionsItem, when destorying itself, will have a hard time looking for something that has already been disposed.
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Accordion',
			AccordionId,
			_accordionMap
		) as OSFramework.OSUI.Patterns.Accordion.IAccordion;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Accordion.IAccordion}
	 */
	export function Initialize(accordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion {
		const accordion = GetAccordionById(accordionId);

		accordion.build();

		return accordion;
	}
}
