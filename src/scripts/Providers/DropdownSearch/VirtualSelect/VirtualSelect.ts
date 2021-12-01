// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DropdownSearch.VirtualSelect {
	/**
	 * Class that implements the Dropdown Search pattern using VirtualSelect as a provider.
	 *
	 * @export
	 * @class OSUIVirtualSelect
	 * @extends {AbstractDropdown<VirtualSelectConfig>}
	 * @implements {IDropdown, IProviderPattern<IVirtualSelect>}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelect
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<VirtualSelectConfig>
		implements OSUIFramework.Patterns.Dropdown.IDropdown, OSUIFramework.Interface.IProviderPattern<IVirtualSelect>
	{
		// Dropdown callback events
		private _onInitializeCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		private _onSelectedOptionCallbackEvent: OSUIFramework.Callbacks.OSDropdownOnSelectEvent;
		private _onSelectedOptionEvent: OSUIFramework.Callbacks.Generic;

		// Provider reference
		public provider: VirtualSelect;
		public providerMethods: VirtualSelectMethods;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectConfig(configs));
		}

		// Create the provider instance
		private _createProviderInstance(): void {
			// Store the ElementId where the provider will create the DropdownSearch
			this.configs.ElementId = '#' + this._selfElem.id;

			// Create the provider instance
			this.provider = window.VirtualSelect.init(this.configs.getProviderConfig());
			this.providerMethods = this.provider.$ele;
			console.log(this.provider);

			// Add the events to be used at provider instance
			this.setCallbacks();

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);

			console.log('CreatedProviderInstance.', this.configs.getProviderConfig());
		}

		private _onSelectedOption() {
			console.log(
				'selectedValues',
				this.provider.selectedValues,
				'selectedOptions',
				this.providerMethods.getSelectedOptions()
			);
		}

		/**
		 * Set the callbacks that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof VirtualSelect
		 */
		protected setCallbacks(): void {
			// Set the event callback reference
			this._onSelectedOptionEvent = this._onSelectedOption.bind(this);

			// Add the event that will get the selected options values
			this._selfElem.addEventListener(Enum.Events.Change, this._onSelectedOptionEvent);
		}

		/**
		 * Builds the DropdownSearch based on provider.
		 *
		 * @memberof VirtualSelect
		 */
		public build(): void {
			super.build();

			this._createProviderInstance();

			super.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param propertyName the name of the property that will be changed
		 * @param propertyValue the new value that should be assigned to the given property name
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			console.log('changeProperty()', propertyName, propertyValue);
		}

		/**
		 * Clear any selected values from the DropdownSearch
		 */
		public clear(): void {
			this.providerMethods.reset();
			this.providerMethods.close();
		}

		/**
		 * Set DropdownSearch as disabled
		 */
		public disable(): void {
			console.log('disable()');
		}

		/**
		 * Destroy the DropdownSearch.
		 *
		 * @memberof VirtualSelect
		 */
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this.provider.destroy();
			}

			super.dispose();
		}

		/**
		 * Set DropdownSearch as enabled
		 */
		public enable(): void {
			console.log('enable()');
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param eventName Event name that will be assigned
		 * @param callback Function name that will be passed as a callback function to the event above
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.Dropdown.Enum.Events.OnInitialize:
					this._onInitializeCallbackEvent = callback;
					break;

				case OSUIFramework.Patterns.Dropdown.Enum.Events.OnSelected:
					this._onSelectedOptionCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}
	}
}
