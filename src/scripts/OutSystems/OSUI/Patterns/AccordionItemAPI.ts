// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AccordionItemAPI {
	const _accordionItemMap = new Map<string, OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem>(); //accordionItem.uniqueId -> AccordionItem obj

	/**
	 * Function that will allow elements inside the title to be clicked without triggering the pattern toggle.
	 *
	 * @export
	 * @param {string} accordionItemId
	 * @return {*}  {string}
	 */
	export function AllowTitleEvents(accordionItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailAllowTitleEvents,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.allowTitleEvents();
			},
		});

		return result;
	}

	/**
	 * Function that will change the property of a given Accordion Item pattern.
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Accordion Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(accordionItemId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailChangeProperty,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function to close the accordionItem
	 *
	 * @export
	 * @param {string} accordionItemId
	 */
	export function Collapse(accordionItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailCollapseItem,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.close();
			},
		});

		return result;
	}

	/**
	 * Create the new Accordion Item instance and add it to the accordionItem Map
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.AccordrionItem.IAccordionItem}
	 */
	export function Create(
		accordionItemId: string,
		configs: string
	): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem {
		if (_accordionItemMap.has(accordionItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.AccordionItem} registered under id: ${accordionItemId}`
			);
		}

		const _newAccordionItem = new OSFramework.OSUI.Patterns.AccordionItem.AccordionItem(
			accordionItemId,
			JSON.parse(configs)
		);

		_accordionItemMap.set(accordionItemId, _newAccordionItem);

		return _newAccordionItem;
	}

	/**
	 * Function that will dispose the instance of the given Accordrion Item
	 *
	 * @export
	 * @param {string} accordionItemId
	 */
	export function Dispose(accordionItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailDispose,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.dispose();

				_accordionItemMap.delete(accordionItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function to open the accordionItem
	 *
	 * @export
	 * @param {string} accordionItemId
	 */
	export function Expand(accordionItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailExpandItem,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.open();
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Accordion Item instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem>}
	 */
	export function GetAllAccordionItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_accordionItemMap);
	}

	/**
	 * Function that gets the instance of an Accordion Item by a given ID.
	 *
	 * @export
	 * @param {string} accodrionItemId ID of the AccordionItem that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem}
	 */
	export function GetAccordionItemById(
		accordionItemId: string
	): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'AccordionItem',
			accordionItemId,
			_accordionItemMap
		) as OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} accordionItemId ID of the Accordion Item pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.AccodrionItem.IAccordionItem}
	 */
	export function Initialize(accordionItemId: string): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem {
		const accordionItem = GetAccordionItemById(accordionItemId);

		accordionItem.build();

		return accordionItem;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} accordionItemId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		accordionItemId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailRegisterCallback,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that enables toggling the active area to expand and collapse the accordion item.
	 *
	 * @export
	 * @param {string} accordionItemId
	 * @param {boolean} isIconOnly
	 * @return {*}  {string}
	 */
	export function ToggleClickableZone(accordionItemId: string, isIconOnly: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.AccordionItem.FailRegisterCallback,
			callback: () => {
				const accordionItem = GetAccordionItemById(accordionItemId);

				accordionItem.changeProperty(
					OSFramework.OSUI.Patterns.AccordionItem.Enum.Properties.ToggleWithIcon,
					isIconOnly
				);
			},
		});

		return result;
	}
}
