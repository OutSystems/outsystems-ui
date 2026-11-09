// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.AccordionItemAPI {
	const _accordionItemMap = new Map<string, OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem>(); //accordionItem.uniqueId -> AccordionItem obj

	/**
	 * Function that will allow elements inside the title to be clicked without triggering the pattern toggle.
	 *
	 * @param accordionItemId The id of the AccordionItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param accordionItemId ID of the Accordion Item where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param accordionItemId The id of the AccordionItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param accordionItemId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the AccordionItem instance
	 */
	export function Create(
		accordionItemId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem {
		if (_accordionItemMap.has(accordionItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.AccordionItem} registered under id: ${accordionItemId}`
			);
		}

		const _newAccordionItem = new OSFramework.OSUI.Patterns.AccordionItem.AccordionItem(
			accordionItemId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_accordionItemMap.set(accordionItemId, _newAccordionItem);

		return _newAccordionItem;
	}

	/**
	 * Function that will dispose the instance of the given Accordrion Item
	 *
	 * @param accordionItemId The id of the AccordionItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param accordionItemId The id of the AccordionItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every AccordionItem instance
	 */
	export function GetAllAccordionItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_accordionItemMap);
	}

	/**
	 * Function that gets the instance of an Accordion Item by a given ID.
	 *
	 * @param accordionItemId ID of the AccordionItem that will be looked for.
	 * @returns the AccordionItem instance
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
	 * @param accordionItemId ID of the Accordion Item pattern that will be initialized.
	 * @returns the AccordionItem instance
	 */
	export function Initialize(accordionItemId: string): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem {
		const accordionItem = GetAccordionItemById(accordionItemId);

		accordionItem.build();

		return accordionItem;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @param accordionItemId The id of the AccordionItem element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		accordionItemId: string,
		eventName: EventName,
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
	 * @param accordionItemId The id of the AccordionItem element
	 * @param isIconOnly Whether only the icon toggles the item
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
