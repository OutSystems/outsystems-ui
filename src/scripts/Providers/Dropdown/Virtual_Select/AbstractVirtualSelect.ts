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

		// Add error message container with a given text
		private _addErrorMessage(text: string): void {
			const errorMessageElement = OSUIFramework.Helper.Dom.ClassSelector(
				this._selfElem.parentElement,
				Enum.CssClass.ErrorMessage
			);

			// Check if the element already exist!
			if (errorMessageElement === undefined) {
				// Create the wrapper container
				const textContainer = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Div);
				textContainer.classList.add(Enum.CssClass.ErrorMessage);
				textContainer.innerHTML = text;

				this._selfElem.parentElement.appendChild(textContainer);
			}
		}

		// Get the selected values options that will be used to pass into platform as a JSON string
		private _getSelectedOptionsStructure(): string {
			// Store the options selected
			let optionsSelected = [];

			// Check if it's multiple type
			if (this.configs.AllowMultipleSelection) {
				optionsSelected = this._virtualselectMethods.getSelectedOptions(); // It returns an array of selected options
			} else {
				// It's single option type
				// Check if there are any selected option
				if (this._virtualselectMethods.getSelectedOptions()) {
					optionsSelected.push(this._virtualselectMethods.getSelectedOptions()); // It returns an single object of selected option
				}
			}

			return optionsSelected !== undefined && optionsSelected.length > 0 ? JSON.stringify(optionsSelected) : '';
		}

		// Manage the attributes to be added
		private _manageAttributes(): void {
			// Check if the pattern should be in disabled mode
			if (this.configs.IsDisabled) {
				this.disable();
			}
		}

		// Manage the disable status of the pattern
		private _manageDisableStatus(): void {
			if (this.configs.IsDisabled) {
				OSUIFramework.Helper.Dom.Attribute.Set(
					this._selfElem,
					OSUIFramework.GlobalEnum.HTMLAttributes.Disabled,
					''
				);
			} else {
				OSUIFramework.Helper.Dom.Attribute.Remove(
					this._selfElem,
					OSUIFramework.GlobalEnum.HTMLAttributes.Disabled
				);
			}
		}

		// Get the selected options and pass them into callBack
		private _onSelectedOption() {
			// Trigger platform's SelectedOptionCallbackEvent client Action
			OSUIFramework.Helper.AsyncInvocation(
				this._platformEventSelectedOptCallback,
				this.widgetId,
				this._getSelectedOptionsStructure()
			);
		}

		// Set the ElementId that is expected from VirtualSelect config
		private _setElementId(): void {
			// Store the ElementId where the provider will create the Dropdown
			this.configs.ElementId = '#' + this._selfElem.id;
		}
		/**
		 * Create the provider instance
		 *
		 * @protected
		 * @memberof AbstractVirtualSelect
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
		 * Method that will be responsible to redraw the dropdown when it's needed
		 *
		 * @protected
		 * @memberof AbstractVirtualSelect
		 */
		protected redraw(): void {
			// Destroy the old VirtualSelect instance
			this._vsProvider.destroy();

			// Create a new flatpickr instance with the updated configs
			OSUIFramework.Helper.AsyncInvocation(this.prepareConfigs.bind(this));
		}

		/**
		 * Set the callbacks that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof AbstractVirtualSelect
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
		 * @memberof AbstractVirtualSelect
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
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof AbstractVirtualSelect
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.AllowMultipleSelection:
						this.redraw();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.IsDisabled:
						this._manageDisableStatus();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.NoResultsText:
						this.redraw();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.OptionsList:
						this.redraw();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.Prompt:
						this.redraw();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.SearchPrompt:
						this.redraw();
						break;
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.SelectedOptions:
						this.redraw();
						break;
				}
			}
		}

		/**
		 * Clear any selected values from the Dropdown
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public clear(): void {
			this._virtualselectMethods.reset();
		}

		/**
		 * Set Dropdown as disabled
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public disable(): void {
			this.configs.IsDisabled = true;

			this._manageDisableStatus();
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public dispose(): void {
			this._vsProvider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Set Dropdown as enabled
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public enable(): void {
			this.configs.IsDisabled = false;

			this._manageDisableStatus();
		}

		/**
		 * Get the selected values
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public getSelectedValues(): string {
			return this._getSelectedOptionsStructure();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof AbstractVirtualSelect
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

		/**
		 * Set the validation status, and also pass the message to show
		 *
		 * @param {boolean} Set if the dropdown is valid or not
		 * @param {string} Pass the text message to show
		 * @memberof AbstractVirtualSelect
		 */
		public validation(isValid: boolean, validationMessage: string): void {
			if (isValid === false) {
				OSUIFramework.Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.NotValid);
				this._addErrorMessage(validationMessage);
			} else {
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.NotValid);

				const errorMessageElement = OSUIFramework.Helper.Dom.ClassSelector(
					this._selfElem.parentElement,
					Enum.CssClass.ErrorMessage
				);

				// If error message has been added already, remove it!
				errorMessageElement !== undefined ? errorMessageElement.remove() : null;
			}
		}

		protected abstract prepareConfigs(): void;
	}
}
