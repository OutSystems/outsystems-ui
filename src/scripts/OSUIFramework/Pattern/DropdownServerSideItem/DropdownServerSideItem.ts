// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 *  Class that implements the DropdownServerSideItem pattern.
	 *
	 * @export
	 * @class DropdownServerSideItem
	 * @extends {AbstractPattern<DropdownServerSideItemConfig>}
	 * @implements {IDropdownServerSideItem}
	 */
	export class DropdownServerSideItem
		extends AbstractPattern<DropdownServerSideItemConfig>
		implements IDropdownServerSideItem
	{
		// Store a reference to the Dropdpown parent Element
		private _dropdownParentElement: HTMLElement;
		// Store the id of of the Dropdown parent
		private _dropdownParentId: string;
		// Store a reference to item Dropdpwn parent Element
		private _dropdownParentReference: Patterns.Dropdown.IDropdown;
		// Click Event
		private _eventOnClick: Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyBoardPress: Callbacks.Generic;
		// Platform Click Event Callback
		private _platformEventOnClickCallback: Callbacks.OSDropdownServerSideItemOnSelectEvent;

		// Store the Key used to trigger the notification into Dropdown parent
		public keyordTriggerdKey: GlobalEnum.Keycodes;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));
		}

		// Function used to get the reference of Dropdown parent
		private _getDropdownParent(): void {
			try {
				const dropdownParentBallonElement = this._selfElem.closest(
					Constants.Dot + Enum.CssClass.DropdownParentBallon
				) as HTMLElement;

				this._dropdownParentId = dropdownParentBallonElement.dataset.dropdownUniqueid;
			} catch (e) {
				// Was not able to get Dropdown parent element!
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}

			// Notify parent about a new instance of this child has been created!
			this._notifyDropdownParent(Patterns.Dropdown.Enum.OptionItemNotificationType.Add);
		}

		// Method that will notify Dropdpwn parent in order to update it's references to DropdownOptionItems!
		private _notifyDropdownParent(type: Patterns.Dropdown.Enum.OptionItemNotificationType): void {
			// Get the Dropdown parent HTML element
			this._dropdownParentElement = Helper.Dom.GetElementByUniqueId(this._dropdownParentId);

			// If Dropdown Exist at Dom
			if (this._dropdownParentElement !== undefined) {
				// Get the DropdownParent reference
				this._dropdownParentReference = OutSystems.OSUI.Patterns.DropdownAPI.GetDropdownById(
					this._dropdownParentId
				);

				// Trigger the notification into parent
				this._dropdownParentReference.beNotifiedFromOptionItem(this.uniqueId, type);
			} else if (Patterns.Dropdown.Enum.OptionItemNotificationType.Add) {
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}
		}

		// A11y keyboard keys
		private _onKeyboardPress(event: KeyboardEvent): void {
			event.preventDefault();
			event.stopPropagation();

			switch (event.key) {
				// If Snter or Space Keys trigger as a click event!
				case GlobalEnum.Keycodes.Enter:
				case GlobalEnum.Keycodes.Space:
					// Unset KeyCode
					this.keyordTriggerdKey = undefined;

					// Triggered as it was clicked!
					this._onSelected(event);
					break;

				// If ArrowUp or ArrowDown keys notify parent to move to prev/next option item!
				case GlobalEnum.Keycodes.ArrowUp:
				case GlobalEnum.Keycodes.ArrowDown:
					// Set KeyCode
					this.keyordTriggerdKey = event.key;

					// Notify parent about the selected key
					this._notifyDropdownParent(Patterns.Dropdown.Enum.OptionItemNotificationType.KeyPressed);
					break;

				// If Tab!
				case GlobalEnum.Keycodes.Tab:
					// If Shift + Tab
					if (event.shiftKey) {
						// Set KeyCode
						this.keyordTriggerdKey = GlobalEnum.Keycodes.ShiftTab;
					} else {
						// Set KeyCode
						this.keyordTriggerdKey = GlobalEnum.Keycodes.Tab;
					}

					// Notify parent about the selected key
					this._notifyDropdownParent(Patterns.Dropdown.Enum.OptionItemNotificationType.KeyPressed);
					break;
			}
		}

		// Trigger the platform callback method
		private _onSelected(event: MouseEvent | KeyboardEvent): void {
			// Notify parent about this Option Click
			this._notifyDropdownParent(
				event.type === 'click'
					? Patterns.Dropdown.Enum.OptionItemNotificationType.Click
					: Patterns.Dropdown.Enum.OptionItemNotificationType.KeyPressed
			);

			// Trigger platform callback about Option has been selected!
			Helper.AsyncInvocation(
				this._platformEventOnClickCallback,
				this._dropdownParentReference.widgetId,
				this.configs.ItemId
			);
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyBoardPress);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setA11yProperties(): void {
			// By default set disable to tabIndex
			// Helper.A11Y.TabIndexFalse(this.selfElement);
			Helper.A11Y.TabIndexTrue(this.selfElement);
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelected.bind(this);
			this._eventOnkeyBoardPress = this._onKeyboardPress.bind(this);
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetCallbacks(): void {
			this._platformEventOnClickCallback = null;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetHtmlElements(): void {
			this._dropdownParentElement = undefined;
			this._dropdownParentId = undefined;
			this._dropdownParentReference = undefined;
		}

		/**
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public build(): void {
			super.build();

			this._getDropdownParent();

			this.setCallbacks();

			this._setUpEvents();

			this.setA11yProperties();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof DropdownServerSideItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			// if (this.isBuilt) {
			// 	switch (propertyName) {
			// 		case Enum.Properties.PROP_NAME:
			// 			// TODO (by CreateNewPattern) Update or Remove
			// 			break;
			// 	}
			// }
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public dispose(): void {
			this.unsetCallbacks();

			this._removeEvents();

			this.unsetHtmlElements();

			// Notify parent about this instance will be destroyed
			this._notifyDropdownParent(Patterns.Dropdown.Enum.OptionItemNotificationType.Removed);

			//Destroying the base of pattern
			super.dispose();
		}
		/**
		 * Method used to register the callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof DropdownServerSideItem
		 */
		public registerCallback(eventName: string, callback: Callbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnSelected:
					if (this._platformEventOnClickCallback === undefined) {
						this._platformEventOnClickCallback = callback;
					}
					break;
				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof DropdownServerSideItem
		 */
		public setA11yTabindex(): void {
			Helper.A11Y.TabIndexTrue(this.selfElement);
		}

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof DropdownServerSideItem
		 */
		public setBlur(): void {
			this.selfElement.blur();
		}

		/**
		 * Method used to set item as focus state
		 *
		 * @memberof DropdownServerSideItem
		 */
		public setFocus(): void {
			this.selfElement.focus();
		}

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof DropdownServerSideItem
		 */
		public unsetA11yTabindex(): void {
			Helper.A11Y.TabIndexFalse(this.selfElement);
		}
	}
}
