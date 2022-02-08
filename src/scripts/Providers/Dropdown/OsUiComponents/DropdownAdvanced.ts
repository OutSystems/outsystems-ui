// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OsUiComponents {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownAdvanced<C extends Dropdown.OsUiComponents.OSUIDropdownAdvancedConfig>
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<DropdownAdvanced, C>
		implements OSUIFramework.Patterns.Dropdown.IDropdown
	{
		// Store the provider options
		protected _dropdownAdvancedOpts: DropdownAdvancedOpts;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Create the provider instance
		private _createProviderInstance(): void {
			// TODO (by CreateNewPattern): create the provider instance
			// this.provider = ...
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUIDropdownAdvanced
		 */
		protected setCallbacks(): void {
			// TODO (by CreateNewPattern): Update or Remove
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownAdvanced
		 */
		protected setHtmlElements(): void {
			// TODO (by CreateNewPattern): Update or Remove
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSUIDropdownAdvanced
		 */
		protected unsetCallbacks(): void {
			// TODO (by CreateNewPattern): Update or Remove
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
		 * @memberof OSUIDropdownAdvanced
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			console.log('DO SOMETHING HERE!');
			// if (this.isBuilt) {
			// 	switch (propertyName) {
			// 		case OSUIFramework.Patterns.Dropdown.Enum.Properties.PROP_NAME:
			// 			// TODO (by CreateNewPattern): Update or Remove
			// 			break;
			// 	}
			// }
		}

		/**
		 * This method have no implementation.
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		public clear(): void {
			console.warn(OSUIFramework.ErrorMessages.DropdownAdvanced.HasNoImplementation);
		}

		/**
		 * Set pattern with a disable status
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		public disable(): void {
			console.log('DO SOMETHING HERE');
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		public dispose(): void {
			this.provider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Remove disable status from
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		public enable(): void {
			console.log('DO SOMETHING HERE');
		}

		/**
		 * This method have no implementation.
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		public getSelectedValues(): string {
			return OSUIFramework.ErrorMessages.DropdownAdvanced.HasNoImplementation;
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSUIDropdownAdvanced
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			console.log('DO SOMETHING HERE!');

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
		 * This method have no implementation.
		 *
		 * @memberof OSUIDropdownAdvanced
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validation(isValid: boolean, validationMessage: string): void {
			console.log(OSUIFramework.ErrorMessages.DropdownAdvanced.HasNoImplementation);
		}
	}
}
