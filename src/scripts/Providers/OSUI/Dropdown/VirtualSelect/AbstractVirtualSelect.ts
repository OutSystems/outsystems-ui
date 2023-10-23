// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect {
	export abstract class AbstractVirtualSelect<C extends Dropdown.VirtualSelect.AbstractVirtualSelectConfig>
		extends OSFramework.OSUI.Patterns.Dropdown.AbstractDropdown<VirtualSelect, C>
		implements IVirtualSelect
	{
		// Store the onResize event
		private _eventOnWindowResize: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Dropdown callback events
		private _onMouseUpEvent: OSFramework.OSUI.GlobalCallbacks.Generic;
		private _onSelectedOptionEvent: OSFramework.OSUI.GlobalCallbacks.Generic;
		private _platformEventSelectedOptCallback: OSFramework.OSUI.Patterns.Dropdown.Callbacks.OSOnSelectEvent;

		// Store the hidden input AriaLabel value
		protected hiddenInputWrapperAriaLabelVal: string;
		// Store a reference of available provider methods
		protected virtualselectConfigs: VirtualSelectMethods;
		// Store the provider options
		protected virtualselectOpts: VirtualSelectOpts;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Add error message container with a given text
		private _addErrorMessage(text: string): void {
			const errorMessageElement = OSFramework.OSUI.Helper.Dom.ClassSelector(
				this.selfElement.parentElement,
				Enum.CssClass.ErrorMessage
			);

			// Check if the element already exist!
			if (errorMessageElement === undefined) {
				// Create the wrapper container
				const textContainer = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Div);
				textContainer.classList.add(Enum.CssClass.ErrorMessage);
				textContainer.innerHTML = text;

				this.selfElement.parentElement.appendChild(textContainer);
			}
		}

		// Manage the attributes to be added
		private _manageAttributes(): void {
			// Manage A11Y attributes
			this.setA11YProperties();
		}

		// Manage the disable status of the pattern
		private _manageDisableStatus(): void {
			if (this.configs.IsDisabled) {
				this.provider.$ele.disable();
			} else {
				this.provider.$ele.enable();
			}
		}

		// Prevent the default behaviour of the event
		private _onMouseUp(event) {
			event.preventDefault();
		}

		// Get the selected options and pass them into callBack
		private _onSelectedOption() {
			// Trigger platform's SelectedOptionCallbackEvent client Action
			this.triggerPlatformEventCallback(this._platformEventSelectedOptCallback, this.getSelectedValues());
		}

		// Close the dropdown if it's open!
		private _onWindowResize() {
			if (this.provider.isOpened()) {
				this.virtualselectConfigs.close();
			}
		}

		// Set the ElementId that is expected from VirtualSelect config
		private _setElementId(): void {
			// Store the ElementId where the provider will create the Dropdown
			this.configs.ElementId = '#' + this.selfElement.id;
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			// Add the event that will get the selected options values
			this.selfElement.addEventListener(Enum.Events.Change, this._onSelectedOptionEvent);

			if (OSFramework.OSUI.Helper.DeviceInfo.GetBrowser() === OSFramework.OSUI.GlobalEnum.Browser.edge) {
				// Prevent the context menu from appearing when clicking on the dropdown multiple times in Edge browser
				this.selfElement.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.MouseUp, this._onMouseUpEvent);
			}

			if (OSFramework.OSUI.Helper.DeviceInfo.IsDesktop) {
				//Set the WindowResize in order to close it if it's open!
				OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
					this._eventOnWindowResize
				);
			}
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this.selfElement.removeEventListener(Enum.Events.Change, this._onSelectedOptionEvent);
			this.selfElement.removeEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.MouseUp, this._onMouseUpEvent);

			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnWindowResize
			);
		}

		/**
		 * Create the provider instance
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected createProviderInstance(): void {
			// Create the provider instance
			this.provider = window.VirtualSelect.init(this.virtualselectOpts);

			/* NOTE: When user change the URL and then click at browser back button we're getting an error. This happen because library (VS - VirtualSelect) creates a new instance of the same object and assign it into an array of VS objects that are in the same screen (in this case 2 equal VS objects since we're creating a new VS instance for each Dropdown), that said and in order to avoid this issue, we must follow this approach. 
			Again, this only happens when user change directly the URL! */
			this.provider = Array.isArray(this.provider) ? this.provider[0] : this.provider;

			this.virtualselectConfigs = this.provider.$ele;
			// Since at native devices we're detaching the balloon from pattern context we must set this attribute to it in order to be possible create a relation between pattern default structure and the detached balloon!
			this.provider.$dropboxContainer.setAttribute(
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.Name,
				this.uniqueId
			);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: Enum.ProviderInfo.Name,
				version: Enum.ProviderInfo.Version,
				events: this.virtualselectConfigs,
			});

			// Add attributes to the element if needed
			this._manageAttributes();

			const _bodyEvent = OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.events.get(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.BodyOnClick
			) as OSFramework.OSUI.Event.DOMEvents.Listeners.IListener;

			if (_bodyEvent) {
				// Add events to change the global event triggering of body click on Open / Close
				this.selfElement.addEventListener(Enum.Events.BeforeOpen, () => {
					_bodyEvent.disableBodyClickEvent();
				});
				this.selfElement.addEventListener(Enum.Events.BeforeClose, () => {
					_bodyEvent.enableBodyClickEvent();
				});
			}

			/**
			 * Trigger Innitialized Event.
			 * - This is needed for the patterns based on a provider since at the Initialized Event at the
			 * Platform side, custom code can be added in order to add customization to the provider.
			 * - This way, Initialized Event will be triggered every time a redraw occurs.
			 */
			this.triggerPlatformInitializedEventCallback();
		}

		/**
		 * Method that adds the necessary attributes for A11Y purposes
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected setA11YProperties(): void {
			// Set the Hidden Input AriaLabel value
			this.setHiddenInputWrapperAriaLabelVal();
		}

		/**
		 * Set the callbacks that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected setCallbacks(): void {
			// Set the events callback reference
			this._eventOnWindowResize = this._onWindowResize.bind(this);
			this._onMouseUpEvent = this._onMouseUp.bind(this);
			this._onSelectedOptionEvent = this._onSelectedOption.bind(this);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected setHtmlElements(): void {
			console.log(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected unsetCallbacks(): void {
			this._eventOnWindowResize = undefined;
			this._onSelectedOptionEvent = undefined;
			this.virtualselectConfigs = undefined;
			this.virtualselectOpts = undefined;
			this.provider = undefined;

			super.unsetCallbacks();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		protected unsetHtmlElements(): void {
			console.log(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public build(): void {
			super.build();

			this._setElementId();

			this.setCallbacks();

			this._setUpEvents();

			this.prepareConfigs();

			this.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Ensure Dropdown will be closed before any possible redraw, since provider needs it!
			this.virtualselectConfigs.close();
			// If/When we've the dropdown outside an IsDataFetched IF and OnParametersChannge where we're receiving (for both cases) a JSON string that must be parsed into an Object
			if (
				(propertyName === Enum.Properties.OptionsList || propertyName === Enum.Properties.StartingSelection) &&
				typeof propertyValue === 'string'
			) {
				propertyValue = JSON.parse(propertyValue);
			}

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.Dropdown.Enum.Properties.IsDisabled:
						this._manageDisableStatus();
						break;
					case Enum.Properties.NoOptionsText:
					case Enum.Properties.NoResultsText:
					case Enum.Properties.OptionsList:
					case Enum.Properties.Prompt:
					case Enum.Properties.SearchPrompt:
						this.redraw();
						break;
					case Enum.Properties.StartingSelection:
						this.setValue(propertyValue as DropDownOption[]);
						console.warn(
							`${OSFramework.OSUI.GlobalEnum.PatternName.Dropdown}: (${this.widgetId}): We recommend using the StartingSelection parameter exclusively for the initial selection and avoid changing it after initialization. To dynamically change the selected options, you should ideally use the DropdownSetValue Client Action.`
						);
						break;
				}
			}
		}

		/**
		 * Clear any selected values from the Dropdown
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public clear(): void {
			this.virtualselectConfigs.reset();
		}

		/**
		 * Method used to close the Dropdown
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public close(): void {
			// SetTimeout is needed in order to ensure there is no conflit between OnClickBody and a button click that trigger this method.
			OSFramework.OSUI.Helper.AsyncInvocation(this.virtualselectConfigs.close.bind(this.virtualselectConfigs));
		}

		/**
		 * Set Dropdown as disabled
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public disable(): void {
			if (this.configs.IsDisabled === false && this.provider !== undefined) {
				this.configs.IsDisabled = true;
				this.provider.$ele.disable();
			}
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
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
			}

			this._unsetEvents();
			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Set Dropdown as enabled
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public enable(): void {
			if (this.configs.IsDisabled && this.provider !== undefined) {
				this.configs.IsDisabled = false;
				this.provider.$ele.enable();
			}
		}

		/**
		 * Get the selected values
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public getSelectedValues(): string {
			let optionsSelected = this.getSelectedOptionsStructure();

			if (optionsSelected !== undefined && optionsSelected.length > 0) {
				optionsSelected = optionsSelected.map(function (option) {
					return {
						group_name:
							option.customData && option.customData.group_name ? option.customData.group_name : '',
						description:
							option.customData && option.customData.description ? option.customData.description : '',
						...option,
					};
				});
				return JSON.stringify(optionsSelected);
			}
			return '';
		}

		/**
		 * Method used to open the Dropdown
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public open(): void {
			// SetTimeout is needed in order to ensure there is no conflit between OnClickBody and a button click that trigger this method.
			OSFramework.OSUI.Helper.AsyncInvocation(this.virtualselectConfigs.open.bind(this.virtualselectConfigs));
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnSelected:
					if (this._platformEventSelectedOptCallback === undefined) {
						this._platformEventSelectedOptCallback = callback;
					}
					break;

				default:
					super.registerCallback(eventName, callback);
					break;
			}
		}

		/**
		 * Method used to set the Hidden Input AriaLabel text value
		 *
		 * @param {string} value
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public setHiddenInputWrapperAriaLabelVal(value?: string): void {
			this.hiddenInputWrapperAriaLabelVal = value === undefined ? this.hiddenInputWrapperAriaLabelVal : value;
			// Set HiddenInput AriaLabel Value
			OSFramework.OSUI.Helper.A11Y.AriaLabel(this.provider.$wrapper, this.hiddenInputWrapperAriaLabelVal);
		}

		/**
		 * Method used to set all the extended VirtualSelect properties across the different types of instances
		 *
		 * @param {VirtualSelectOpts} newConfigs
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public setProviderConfigs(newConfigs: VirtualSelectOpts): void {
			this.configs.setExtensibilityConfigs(newConfigs);
			this.redraw();
			super.setProviderConfigs(newConfigs);
		}

		/**
		 * Method used to set the Dropdown options values dynamically
		 *
		 * @param {DropDownOption[]} optionsToSelect List of options to bet set
		 * @param {boolean} silentOnChangedEvent If True, OnChange event will not be triggered
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public setValue(optionsToSelect: DropDownOption[], silentOnChangedEvent = true): void {
			const selectedValues = this.getSelectedOptionsStructure().map((value) => value.value) || [];
			let valuesToSelect = [];

			if (optionsToSelect.length > 0) {
				if (this.virtualselectOpts.multiple) valuesToSelect = optionsToSelect.map((option) => option.value);
				else valuesToSelect = [optionsToSelect[0].value];
			}

			if (valuesToSelect.sort().join(' ') !== selectedValues.sort().join(' '))
				this.virtualselectConfigs.setValue(valuesToSelect, silentOnChangedEvent);
		}

		/**
		 * Toggle the dropbox as popup on small screen like mobile
		 *
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public togglePopup(isEnabled: boolean): void {
			if (this.configs.ShowDropboxAsPopup !== isEnabled) {
				this.configs.ShowDropboxAsPopup = isEnabled;
				this.redraw();
			}
		}

		/**
		 * Set the validation status, and also pass the message to show
		 *
		 * @param {boolean} Set if the dropdown is valid or not
		 * @param {string} Pass the text message to show
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelect
		 */
		public validation(isValid: boolean, validationMessage: string): void {
			if (isValid === false) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.NotValid);
				this._addErrorMessage(validationMessage);
			} else {
				OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.NotValid);

				const errorMessageElement = OSFramework.OSUI.Helper.Dom.ClassSelector(
					this.selfElement.parentElement,
					Enum.CssClass.ErrorMessage
				);

				// If error message has been added already, remove it!
				if (errorMessageElement) {
					errorMessageElement.remove();
				}
			}
		}

		// Common methods all Dropdowns must implement!
		protected abstract getSelectedOptionsStructure(): DropDownOption[];
		protected abstract prepareConfigs(): void;
	}
}
