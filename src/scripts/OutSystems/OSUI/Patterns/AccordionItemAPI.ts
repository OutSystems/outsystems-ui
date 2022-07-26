// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AccordionItemAPI {
	const _accordionItemMap = new Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>(); //accordionItem.uniqueId -> AccordionItem obj

	/**
	 * Function that will allow elements inside the title to be clicked without triggering the pattern toggle.
	 *
	 * @export
	 * @param {string} accordionItemId
	 * @return {*}  {string}
	 */
	export function AllowTitleEvents(accordionItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.allowTitleEvents();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailExpandItem;
		}

		return JSON.stringify(responseObj);
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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to close the accordionItem
	 *
	 * @export
	 * @param {string} accordionItemId
	 */
	export function Collapse(accordionItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailCollapseItem;
		}

		return JSON.stringify(responseObj);
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
		if (_accordionItemMap.has(accordionItemId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternName.AccordionItem} registered under id: ${accordionItemId}`
			);
		}

		const _newAccordionItem = new OSUIFramework.Patterns.AccordionItem.AccordionItem(
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
	 * @param {string} accordrionItemId
	 */
	export function Dispose(accordionItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.dispose();

			_accordionItemMap.delete(accordionItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to open the accordionItem
	 *
	 * @export
	 * @param {string} accordionItemId
	 */
	export function Expand(accordionItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailExpandItem;
		}

		return JSON.stringify(responseObj);
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
	export function RegisterCallback(accordionItemId: string, callback: OSUIFramework.Callbacks.Generic): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const accordionItem = GetAccordionItemById(accordionItemId);

			accordionItem.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.AccordionItem.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}
}
