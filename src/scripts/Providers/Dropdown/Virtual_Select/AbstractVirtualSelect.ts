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
			// Create the wrapper container
			const textContainer = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Div);
			textContainer.classList.add(Enum.CssClass.ErrorMessage);
			textContainer.innerHTML = text;

			this._selfElem.appendChild(textContainer);
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
			console.log('changeProperty()', propertyName, propertyValue);
		}

		/**
		 * Clear any selected values from the DropdownSearch
		 *
		 * @memberof AbstractVirtualSelect
		 */
		// TODO - jRio: implement API method!
		public clear(): void {
			this._virtualselectMethods.reset();
		}

		/**
		 * Set DropdownSearch as disabled
		 *
		 * @memberof AbstractVirtualSelect
		 */
		// TODO - jRio: implement API method!
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
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public dispose(): void {
			this._vsProvider.destroy();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Set DropdownSearch as enabled
		 *
		 * @memberof AbstractVirtualSelect
		 */
		// TODO - jRio: implement API method!
		public enable(): void {
			OSUIFramework.Helper.Dom.Attribute.Remove(this._selfElem, OSUIFramework.GlobalEnum.HTMLAttributes.Disabled);

			this.configs.IsDisabled = false;
		}

		/**
		 * Get the selected values
		 *
		 * @memberof AbstractVirtualSelect
		 */
		// TODO - jRio: implement API method!
		public getSelectedValues(): string {
			const selectedOptions = this._virtualselectMethods.getSelectedOptions();

			return JSON.stringify(selectedOptions);
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
		 * @param {boolean} [isValid=true] Set if the dropdown is valid or not
		 * @param {string} [validationMessage=''] Pass the text message to show
		 * @memberof AbstractVirtualSelect
		 */
		// TODO - jRio: implement API method!
		public validation(isValid = true, validationMessage = ''): void {
			if (isValid === false) {
				OSUIFramework.Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.NotValid);
				this._addErrorMessage(validationMessage);
			} else {
				const errorMessageElement = OSUIFramework.Helper.Dom.ClassSelector(
					this._selfElem,
					Enum.CssClass.NotValid
				);

				// If error message has been added already, remove it!
				errorMessageElement !== undefined ? errorMessageElement.remove() : null;
			}
		}

		protected abstract prepareConfigs(): void;
	}
}
