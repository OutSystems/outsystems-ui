/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.AccordionAPI {
	const _accordionMap = new Map<string, OSUIFramework.Patterns.Accordion.IAccordion>(); //Accordion.uniqueId -> Accordion obj

	/**
	 * Function that will change the property of a given Accordion pattern.
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(accordionId: string, propertyName: string, propertyValue: unknown): void {
		const accordion = GetAccordionById(accordionId);

		accordion.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Function that will collapse all the expanded items in a given accordion
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern.
	 *
	 */
	export function CollapseAllItems(accordionId: string): void {
		const accordion = GetAccordionById(accordionId);
		accordion.collapseAllItems();
	}

	/**
	 * Create the new Accordion instance and add it to the AccordionMap
	 *
	 * @export
	 * @param {string} accordionId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Accordion.IAccordion}
	 */
	export function Create(accordionId: string, configs: string): OSUIFramework.Patterns.Accordion.IAccordion {
		if (_accordionMap.has(accordionId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Accordion} registered under id: ${accordionId}`
			);
		}

		const _newAccordion = new OSUIFramework.Patterns.Accordion.Accordion(accordionId, JSON.parse(configs));

		_accordionMap.set(accordionId, _newAccordion);

		return _newAccordion;
	}

	/**
	 * Function that will dispose the instance of the given Accordion
	 *
	 * @export
	 * @param {string} accordionId
	 */
	export function Dispose(accordionId: string): void {
		const accordion = GetAccordionById(accordionId);

		accordion.dispose();

		_accordionMap.delete(accordion.uniqueId);
	}

	/**
	 * Function that will expand all the collapsed items in a given accordion
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern.
	 *
	 */
	export function ExpandAllItems(accordionId: string): void {
		const accordion = GetAccordionById(accordionId);
		accordion.expandAllItems();
	}

	/**
	 * Fucntion that will return the Map with all the Accordion instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Accordion.IAccordion>}
	 */
	export function GetAllAccordions(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_accordionMap);
	}

	/**
	 * Function that gets the instance of an Accordion by a given ID.
	 *
	 * @export
	 * @param {string} AccordionId ID of the Accordion that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Accordion.IAccordion}
	 */
	export function GetAccordionById(AccordionId: string): OSUIFramework.Patterns.Accordion.IAccordion {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Accordion',
			AccordionId,
			_accordionMap
		) as OSUIFramework.Patterns.Accordion.IAccordion;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} accordionId ID of the Accordion pattern that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.Accordion.IAccordion}
	 */
	export function Initialize(accordionId: string): OSUIFramework.Patterns.Accordion.IAccordion {
		const accordion = GetAccordionById(accordionId);

		accordion.build();

		return accordion;
	}
}
