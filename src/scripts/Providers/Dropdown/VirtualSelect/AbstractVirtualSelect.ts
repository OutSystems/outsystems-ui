// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect {
	export abstract class AbstractVirtualSelect<C extends Dropdown.VirtualSelect.AbstractVirtualSelectConfig>
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

		// Manage the attributes to be added
		private _manageAttributes(): void {
			// Check if the pattern should be in disabled mode
			if (this.configs.IsDisabled) {
				this.disable();
			}
		}

		// Manage the disable status of the pattern
		private _manageDisableStatus(): void {
			// Ensure that is closed!
			this._virtualselectMethods.close();

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
				this.getSelectedOptionsStructure()
			);
		}

		// Set the ElementId that is expected from VirtualSelect config
		private _setElementId(): void {
			// Store the ElementId where the provider will create the Dropdown
			this.configs.ElementId = '#' + this._selfElem.id;
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			// Add the event that will get the selected options values
			this._selfElem.addEventListener(Enum.Events.Change, this._onSelectedOptionEvent);
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this._selfElem.removeEventListener(Enum.Events.Change, this._onSelectedOptionEvent);
		}

		/**
		 * Create the provider instance
		 *
		 * @protected
		 * @memberof AbstractVirtualSelect
		 */
		protected createProviderInstance(): void {
			// Create the provider instance
			this.provider = window.VirtualSelect.init(this._virtualselectOpts);

			/* NOTE: When user change the URL and then click at browser back button we're getting an error. This happen because library (VS - VirtualSelect) creates a new instance of the same object and assign it into an array of VS objects that are in the same screen (in this case 2 equal VS objects since we're creating a new VS instance for each Dropdown), that said and in order to avoid this issue, we must follow this approach. 
			Again, this only happens when user change directly the URL! */
			this.provider = Array.isArray(this.provider) ? this.provider[0] : this.provider;

			this._virtualselectMethods = this.provider.$ele;
			// Since at native devices we're detaching the balloon from pattern context we must set this attribute to it in order to be possible create a relation between pattern default structure and the detached balloon!
			this.provider.$dropboxContainer.setAttribute(OSUIFramework.GlobalEnum.HTMLAttributes.Name, this.uniqueId);

			// Add the pattern Events!
			this._setUpEvents();

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
			this.provider.destroy();

			// Create a new VirtualSelect instance with the updated configs
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
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof AbstractVirtualSelect
		 */
		protected unsetCallbacks(): void {
			this._onSelectedOptionEvent = undefined;
			this._virtualselectMethods = undefined;
			this._virtualselectOpts = undefined;
			this.provider = undefined;
		}

		public build(): void {
			super.build();

			this._setElementId();

			this.setCallbacks();

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
			// If/When we've the dropdown outside an IsDataFetched IF and OnParametersChannge where we're receiving (for both cases) a JSON string that must be parsed into an Object
			if (
				(propertyName === Enum.Properties.OptionsList || propertyName === Enum.Properties.SelectedOptions) &&
				typeof propertyValue === 'string'
			) {
				propertyValue = JSON.parse(propertyValue);
			}

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.Dropdown.Enum.Properties.IsDisabled:
						this._manageDisableStatus();
						break;
					case Enum.Properties.NoResultsText:
						this.redraw();
						break;
					case Enum.Properties.OptionsList:
						this.redraw();
						break;
					case Enum.Properties.Prompt:
						this.redraw();
						break;
					case Enum.Properties.SearchPrompt:
						this.redraw();
						break;
					case Enum.Properties.SelectedOptions:
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
			if (this.isBuilt) {
				/* Due to VirtualSelect (VS) library implementation we must check if the provider is an array of elements in screen...
				- by default, library will have an object instance containing all the Dropdowns (DDs) that has been added to screen, which we're not using since we're creating an instance for each DD added and store it at **this.provider**;
				- this was only happens when there are DDs in several screens and we're navigating through them;
				- during screen navigation, platform will create the new screen before removing the old one, at that moment VS will add a new instance to it's context (our this.provider), that way we ends up on having an array of items that we must destroy instead only one as we had before this fix!
				- that's why we must check if we have an array of items at our this.provider and destroy all of them! */
				if (Array.isArray(this.provider)) {
					for (const element of this.provider) {
						element.destroy();
					}
				} else {
					this.provider.destroy();
				}

				this.unsetCallbacks();
				this._unsetEvents();

				super.dispose();
			}
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
			return this.getSelectedOptionsStructure();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof AbstractVirtualSelect
		 */
		public registerCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.Dropdown.Enum.Events.Initialized:
					if (this._platformEventInitializedCallback === undefined) {
						this._platformEventInitializedCallback = callback;
					}
					break;

				case Enum.Events.OnSelected:
					if (this._platformEventSelectedOptCallback === undefined) {
						this._platformEventSelectedOptCallback = callback;
					}
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}

		/**
		 * Toggle the dropbox as popup on small screen like mobile
		 *
		 * @memberof AbstractVirtualSelect
		 */
		public togglePopup(isEnabled: boolean): void {
			if (this.configs.ShowDropboxAsPopup !== isEnabled) {
				this.configs.ShowDropboxAsPopup = isEnabled;
				this.configs.setDropboxWrapperConfig(isEnabled);
				this.redraw();
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
				if (errorMessageElement) {
					errorMessageElement.remove();
				}
			}
		}

		protected abstract getSelectedOptionsStructure(): string;
		protected abstract prepareConfigs(): void;
	}
}
