// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AccordionItemAPI {
	const _accordionMap = new Map<string, string>(); //accordionItem.uniqueId -> Accordion.uniqueId
	const _accordionItemMap = new Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>(); //accordionItem.uniqueId -> AccordionItem obj

	/**
	 * Gets the Accordion pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Accordion.IAccordion>}
	 */
	export function GetAccordionByItem(accordionItemId: string): OSUIFramework.Patterns.Accordion.IAccordion {
		let accordion: OSUIFramework.Patterns.Accordion.IAccordion;

		if (_accordionMap.has(accordionItemId)) {
			accordion = AccordionAPI.GetAccordionById(_accordionMap.get(accordionItemId));
		} else {
			// Try to find the accordion reference on DOM
			const elem = OSUIFramework.Helper.GetElementByUniqueId(accordionItemId);
			const accordionElem = elem.closest(OSUIFramework.Patterns.Accordion.Enum.CssClass.AccordionWrapper);
			if (accordionElem) {
				const uniqueId = accordionElem.getAttribute('name');
				accordion = AccordionAPI.GetAccordionById(uniqueId);
			}
			// Else, it's a 'free' accordion item, no accordion as parent
		}

		return accordion;
	}
	/**
	 * Function that will change the property of a given Accordion Item pattern.
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Accordion Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(accordionItemId: string, propertyName: string, propertyValue: any): void {
		const accordionItem = GetAccordionItemById(accordionItemId);

		accordionItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Accordion Item instance and add it to the accordionItem Map
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.AccordrionItem.IAccordionItem}
	 */
	export function Create(
		accordionItemId: string,
		configs: string
	): OSUIFramework.Patterns.AccordionItem.IAccordionItem {
		const config = JSON.parse(configs);
		if (_accordionItemMap.has(accordionItemId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.AccordionItem} registered under id: ${accordionItemId}`
			);
		}
		const accordion = GetAccordionByItem(accordionItemId);

		config.AccordionParent = accordion;

		const _newAccordionItem = new OSUIFramework.Patterns.AccordionItem.AccordionItem(accordionItemId, config);

		_accordionItemMap.set(accordionItemId, _newAccordionItem);
		_newAccordionItem.build();
		if (accordion !== undefined) {
			_accordionMap.set(accordionItemId, accordion.uniqueId);
			accordion.addAccordionItem(_newAccordionItem.uniqueId, _newAccordionItem);
		}

		return _newAccordionItem;
	}

	/**
	 * Function that will dispose the instance of the given Accordrion Item
	 *
	 * @export
	 * @param {string} accordrionItemId
	 */
	export function Dispose(accordionItemId: string): void {
		const accordionItem = GetAccordionItemById(accordionItemId);

		//When destroying the whole pattern Accordion + Accordion Item, the parent is destroyed first
		//So, there is no parent to disconnect from.
		if (accordionItem) {
			const accordion = GetAccordionByItem(accordionItemId);

			if (accordion !== undefined) {
				accordion.removeAccordionItem(accordionItem.uniqueId);
			}
		}

		accordionItem.dispose();

		_accordionItemMap.delete(accordionItem.uniqueId);
		_accordionMap.delete(accordionItem.uniqueId);
	}

	/**
	 * Function that will return the Map with all the Accordion Item instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>}
	 */
	export function GetAllAccordionItems(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_accordionItemMap);
	}

	/**
	 * Function that gets the instance of an Accordion Item by a given ID.
	 *
	 * @export
	 * @param {string} accodrionItemId ID of the AccordionItem that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.AccordionItem.IAccordionItem}
	 */
	export function GetAccordionItemById(accordionItemId: string): OSUIFramework.Patterns.AccordionItem.IAccordionItem {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'AccordionItem',
			accordionItemId,
			_accordionItemMap
		) as OSUIFramework.Patterns.AccordionItem.IAccordionItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Accordion Item pattern that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.AccodrionItem.IAccordionItem}
	 */
	export function Initialize(accordionItemId: string): OSUIFramework.Patterns.AccordionItem.IAccordionItem {
		const accordionItem = GetAccordionItemById(accordionItemId);

		accordionItem.build();

		return accordionItem;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} accordionItemId
	 * @param {*} callback
	 */
	export function RegisterCallback(
		accordionItemId: string,
		callback: OSUIFramework.Callbacks.OSAccordionItemToggleEvent
	): void {
		const accordionItem = GetAccordionItemById(accordionItemId);

		accordionItem.registerCallback(callback);
	}
}
