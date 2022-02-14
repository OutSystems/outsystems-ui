// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSide<C extends Dropdown.OSUIComponents.OSUIDropdownServerSideConfig>
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<DropdownAdvanced, C>
		implements OSUIFramework.Patterns.Dropdown.IDropdown
	{
		// Store the HTML element for the DropdownBaloon
		private _dropdownBaloonElement: HTMLElement;

		// Store a collection of all DropdownServerSideItems ids inside this DropdownServerSide instance
		private _optionItems = new Map<string, OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem>(); //DropdownServerSideItem.uniqueId -> DropdownServerSideItem obj

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log('NEW DropdownSS', this.uniqueId);
		}

		// Create the provider instance
		private _createProviderInstance(): void {
			// console.log(
			// 	this.uniqueId +
			// 		' DropdownServerSide - _createProviderInstance() => TODO (by CreateNewPattern): create the provider instance'
			// );
			// this.provider = ...
		}

		// Move ballon element to outside of the pattern context
		private _moveBallonElement(): void {
			const layoutElement = OSUIFramework.Helper.Dom.TagSelector(
				document.body,
				OSUIFramework.Constants.Dot + OSUIFramework.Constants.LayoutClass
			) as HTMLElement;

			OSUIFramework.Helper.Dom.Move(this._dropdownBaloonElement, layoutElement);
		}

		// Method used to store a given DropdownOption into optionItems list, it's triggered by DropdownServerSideItem
		private _setNewOptionItem(optionItemId: string): void {
			// Get the DropdownOptionItem reference
			const optionItem =
				OutSystems.OSUI.Patterns.DropdownServerSideItemAPI.GetDropdownServerSideItemItemById(optionItemId);

			// Check if the given OptionId has been already added
			if (this._optionItems.has(optionItemId)) {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailSetNewOptionItem}: There is already a ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under Id: '${optionItem.widgetId}' added to ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store DropDownOption Item
				this._optionItems.set(optionItemId, optionItem);
			}
		}

		// Method used to remove a given DropdownOption from optionItems list, it's triggered by DropdownServerSideItem
		private _unsetNewOptionItem(optionItemId: string): void {
			// Check if the given OptionId exist at optionsList
			if (this._optionItems.has(optionItemId)) {
				this._optionItems.delete(optionItemId);
			} else {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailUnsetNewOptionItem}: The ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist has a OptionItem from ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setCallbacks(): void {
			console.log('SetCallbacks');
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			this._dropdownBaloonElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.DropdownBallonWrapper
			);

			// TODO
			// Ensure that the Move only happens after HTML elements has been set!
			// this._moveBallonElement();
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

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected unsetHtmlElements(): void {
			// Ensure that the ballon has been removed from the DOM since it has been Moved to outside of pattern context.
			this._dropdownBaloonElement.remove();

			// unset the local property
			this._dropdownBaloonElement = undefined;
		}

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param optionItemId Dropdown Option Item Id to be stored
		 * @param notifiedTo {Enum.OptionItemNotificationType} triggered notification type
		 * @memberof OSUIDropdownServerSide
		 */
		public beNotifiedFromOptionItem(
			optionItemId: string,
			notifiedTo: OSUIFramework.Patterns.Dropdown.Enum.OptionItemNotificationType
		): void {
			switch (notifiedTo) {
				case OSUIFramework.Patterns.Dropdown.Enum.OptionItemNotificationType.Add:
					this._setNewOptionItem(optionItemId);
					break;
				case OSUIFramework.Patterns.Dropdown.Enum.OptionItemNotificationType.Click:
					console.log('Option Has Been Clicked!');
					break;
				case OSUIFramework.Patterns.Dropdown.Enum.OptionItemNotificationType.KeyPressed:
					console.log('Option Has Been Selected by KeyBoard!');
					break;
				case OSUIFramework.Patterns.Dropdown.Enum.OptionItemNotificationType.Removed:
					this._unsetNewOptionItem(optionItemId);
					break;
				default:
					throw new Error(
						`${OSUIFramework.ErrorCodes.Dropdown.FailToSetOptionItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		public build(): void {
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
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
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
			this.unsetCallbacks();

			this.unsetHtmlElements();

			this.provider.destroy();

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
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
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
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validation(isValid: boolean, validationMessage: string): void {
			throw new Error(
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}
	}
}
