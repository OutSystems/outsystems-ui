// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.Virtual_Select {
	export abstract class AbstractVirtualSelect<C extends Dropdown.Virtual_Select.AbstractVirtualSelectConfig>
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<VirtualSelect, C>
		implements IVirtualSelect
	{
		// Dropdown callback events
		private _onSelectedOptionEvent: OSUIFramework.Callbacks.Generic;
		private _platformEventInitializedCallback: OSUIFramework.Callbacks.OSGeneric;
		private _platformEventSelectedOptCallback: OSUIFramework.Callbacks.OSDropdownOnSelectEvent;

		// Store a reference of available provider methods
		protected _virtualselectMethods: VirtualSelectMethods;
		// Store the provider options
		protected _virtualselectOpts: VirtualSelectOpts;
		// Store the virtualSelect provider reference
		protected _vsProvider: VirtualSelect;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Manage the attributes to be added
		private _manageAttributes(): void {
			// Check if the pattern should be in disabled mode
			if (this.configs.IsDisabled) {
				this.disable();
			}
		}

		// Get the selected options and pass them into callBack
		private _onSelectedOption() {
			// Store the options selected
			let optionsSelected = [];

			// Check if it's multiple type
			if (this.configs.ShowCheckboxes) {
				optionsSelected = this._virtualselectMethods.getSelectedOptions(); // It returns an array of selected options
			} else {
				// It's single option type
				// Check if there are any selected option
				if (this._virtualselectMethods.getSelectedOptions()) {
					optionsSelected.push(this._virtualselectMethods.getSelectedOptions()); // It returns an single object of selected option
				}
			}

			// Trigger platform's SelectedOptionCallbackEvent client Action
			OSUIFramework.Helper.AsyncInvocation(
				this._platformEventSelectedOptCallback,
				this.widgetId,
				JSON.stringify(optionsSelected)
			);
		}

		// Set the ElementId that is expected from VirtualSelect config
		private _setElementId(): void {
			// Store the ElementId where the provider will create the DropdownSearch
			this.configs.ElementId = '#' + this._selfElem.id;
		}

		/**
		 * Create the provider instance
		 *
		 * @protected
		 * @memberof VirtualSelect
		 */
		protected createProviderInstance(): void {
			// Create the provider instance
			this._vsProvider = window.VirtualSelect.init(this._virtualselectOpts);
			this._virtualselectMethods = this._vsProvider.$ele;

			// Add the events to be used at provider instance
			this.setCallbacks();

			// Add attributes to the element if needed
			this._manageAttributes();

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._platformEventInitializedCallback, this.widgetId);
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
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof VirtualSelect
		 */
		protected unsetCallbacks(): void {
			this._onSelectedOptionEvent = undefined;

			this._selfElem.removeEventListener(Enum.Events.Change, this._onSelectedOptionEvent);
		}

		public build(): void {
			super.build();

			this._setElementId();

			this.prepareConfigs();

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
			this._virtualselectMethods.reset();
		}

		/**
		 * Set DropdownSearch as disabled
		 */
		public disable(): void {
			OSUIFramework.Helper.Dom.Attribute.Set(
				this._selfElem,
				OSUIFramework.GlobalEnum.HTMLAttributes.Disabled,
				''
			);

			this.configs.IsDisabled = true;
		}

		/**
		 * Destroy the DropdownSearch.
		 */
		public dispose(): void {
			this._vsProvider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Set DropdownSearch as enabled
		 */
		public enable(): void {
			OSUIFramework.Helper.Dom.Attribute.Remove(this._selfElem, OSUIFramework.GlobalEnum.HTMLAttributes.Disabled);

			this.configs.IsDisabled = false;
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param eventName Event name that will be assigned
		 * @param callback Function name that will be passed as a callback function to the event above
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.Dropdown.Enum.Events.Initialized:
					if (this._platformEventInitializedCallback === undefined) {
						this._platformEventInitializedCallback = callback;
					}
					break;

				case OSUIFramework.Patterns.Dropdown.Enum.Events.OnSelected:
					if (this._platformEventSelectedOptCallback === undefined) {
						this._platformEventSelectedOptCallback = callback;
					}
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}

		protected abstract prepareConfigs(): void;
	}
}
