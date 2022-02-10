// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSide<C extends Dropdown.OSUIComponents.OSUIDropdownServerSideConfig>
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<DropdownAdvanced, C>
		implements OSUIFramework.Patterns.Dropdown.IDropdown
	{
		// Store a collection of all DropdownServerSideItems ids inside this DropdownServerSide instance
		private _optionItems = new Map<string, OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem>(); //DropdownServerSideItem.uniqueId -> DropdownServerSideItem obj

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log(this.uniqueId + ' DropdownServerSide - constructor()', this.configs);
		}

		// Create the provider instance
		private _createProviderInstance(): void {
			console.log(
				this.uniqueId +
					' DropdownServerSide - _createProviderInstance() => TODO (by CreateNewPattern): create the provider instance'
			);
			// this.provider = ...
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setCallbacks(): void {
			console.log(
				this.uniqueId + ' DropdownServerSide - setCallbacks() => TODO (by CreateNewPattern): Update or Remove'
			);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			console.log(
				this.uniqueId +
					' DropdownServerSide - setHtmlElements() => TODO (by CreateNewPattern): Update or Remove'
			);
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected unsetCallbacks(): void {
			console.log(
				this.uniqueId + ' DropdownServerSide - unsetCallbacks() => TODO (by CreateNewPattern): Update or Remove'
			);
		}

		public build(): void {
			console.log(this.uniqueId + ' DropdownServerSide - build()');

			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			this._createProviderInstance();

			super.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUIDropdownServerSide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// console.log(this.uniqueId + ' DropdownServerSide - changeProperty()');

			super.changeProperty(propertyName, propertyValue);

			// if (this.isBuilt) {
			// 	switch (propertyName) {
			// 		case OSUIFramework.Patterns.Dropdown.Enum.Properties.PROP_NAME:
			// 			// TODO (by CreateNewPattern): Update or Remove
			// 			break;
			// 	}
			// }
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public clear(): void {
			throw new Error(
				OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code +
					': ' +
					OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message
			);
		}

		/**
		 * Set pattern with a disable status
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public disable(): void {
			// console.log(this.uniqueId + ' DropdownServerSide - disable()');
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public dispose(): void {
			this.provider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Remove disable status from
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public enable(): void {
			// console.log(this.uniqueId + ' DropdownServerSide - enable()');
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public getSelectedValues(): string {
			throw new Error(
				OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code +
					': ' +
					OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message
			);
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSUIDropdownServerSide
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			// console.log(this.uniqueId + ' DropdownServerSide - registerProviderCallback()');
			// switch (eventName) {
			// 	case OSUIFramework.Patterns.Dropdown.Enum.Events.EVENT_NAME:
			// 		// TODO (by CreateNewPattern): Update or Remove
			// 		break;
			// 	default:
			// 		/* TODO (by CreateNewPattern):
			// 			The line below is created by the CreateNewPattern mechanism, that is not able to replace values
			// 			as expected, that said, check other patterns to understand how to replace it!
			// 		*/
			// 		throw new Error("The givem '" + eventName + "' event name it's not defined.");
			// }
		}

		/**
		 * Method used to check if the given OptionItemId could be added as a Dropdown OptionItem
		 *
		 * @param optionItemId Id of the OptionItem to be added to the Dropdown instance
		 * @returns {boolean} Option has been added as an OptionItem of Dropdown instance
		 */
		public setNewOptionItem(optionItemId: string): boolean {
			// Get the DropdownOptionItem reference
			const optionItem =
				OutSystems.OSUI.Patterns.DropdownServerSideItemAPI.GetDropdownServerSideItemItemById(optionItemId);

			console.log('optionItem', optionItem);

			// if (this._selfElem.contains(optionItem))
			// try {
			// 	console.log('optionItem', optionItem);
			// } catch (e) {
			// 	// Was not able to get DropdownOptionItem element!
			// 	throw new Error(
			// 		OSUIFramework.ErrorCodes.Dropdown.FailSetNewOptionItem +
			// 			': ' +
			// 			`${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under id: '${optionItemId}' can not be added as an OptionItem of ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with id '${this.widgetId}'!`
			// 	);
			// }

			return true;
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validation(isValid: boolean, validationMessage: string): void {
			throw new Error(
				OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code +
					': ' +
					OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message
			);
		}
	}
}
