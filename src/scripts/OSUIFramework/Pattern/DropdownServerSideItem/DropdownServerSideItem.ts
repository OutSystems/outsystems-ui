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
		extends AbstractChild<DropdownServerSideItemConfig, Providers.Dropdown.OSUIComponents.IDropdownServerSide>
		implements IDropdownServerSideItem
	{
		// Click Event
		private _eventOnClick: Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyboardPress: Callbacks.Generic;
		// Platform Click Event Callback
		private _platformEventOnClickCallback: Callbacks.OSDropdownServerSideItemOnSelectEvent;

		// Store the Key used to trigger the notification into Dropdown parent
		public keyboardTriggeredKey: string;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));
		}

		// A11y keyboard keys
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.preventDefault();
			event.stopPropagation();

			// Set KeyCode
			this.keyboardTriggeredKey = event.key;

			switch (event.key) {
				// If Enter or Space Keys trigger as a click event!
				case GlobalEnum.Keycodes.Enter:
				case GlobalEnum.Keycodes.Space:
					// Triggered as it was clicked!
					this._onSelected(event);
					break;

				// If ArrowUp, ArrowDown or Escape keys, notify parent to move to prev/next option item!
				case GlobalEnum.Keycodes.ArrowUp:
				case GlobalEnum.Keycodes.ArrowDown:
				case GlobalEnum.Keycodes.Escape:
					// Notify parent about the selected key
					this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.KeyPressed);
					break;

				// If Tab!
				case GlobalEnum.Keycodes.Tab:
					// If Shift + Tab (Since it doesn't exist as a unique key, it must be 'fabricated')
					if (event.shiftKey) {
						// Set KeyCode
						this.keyboardTriggeredKey = GlobalEnum.Keycodes.ShiftTab;
					} else {
						// Set KeyCode
						this.keyboardTriggeredKey = GlobalEnum.Keycodes.Tab;
					}

					// Notify parent about the selected key
					this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.KeyPressed);
					break;
			}
		}

		// Trigger the platform callback method
		private _onSelected(event: MouseEvent | KeyboardEvent): void {
			event.stopPropagation();

			// Notify parent about this Option Click
			this.notifyParent(
				event.type === GlobalEnum.HTMLEvent.Click
					? Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Click
					: Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.KeyPressed
			);
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyboardPress);
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyboardPress);
		}

		// Update the Selected Status value based on a given Status
		private _updateSelectedStatus(status: boolean): void {
			// Set IsSelected status variable
			this.configs.IsSelected = status;

			// Update accessible property accordingly
			if (this.configs.IsSelected) {
				Helper.A11Y.AriaSelectedTrue(this.selfElement);
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsSelected);
			} else {
				Helper.A11Y.AriaSelectedFalse(this.selfElement);
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsSelected);
			}
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setA11yProperties(): void {
			// By default set disable to tabIndex
			Helper.A11Y.TabIndexFalse(this.selfElement);
			// Set balloon option items container with listbox as a role
			Helper.A11Y.RoleOption(this.selfElement);
			// Set Item as Unselected by default
			Helper.A11Y.AriaSelectedFalse(this.selfElement);
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelected.bind(this);
			this._eventOnkeyboardPress = this._onKeyboardPressed.bind(this);
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
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public build(): void {
			super.build();

			// Store parent info
			this.setParentInfo(
				Constants.Dot + Enum.CssClass.DropdownParentBalloon,
				OutSystems.OSUI.Patterns.DropdownAPI.GetDropdownById
			);

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Add);

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

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsSelected:
						this._updateSelectedStatus(propertyValue as boolean);
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this._removeEvents();

				// Notify parent about this instance will be destroyed
				this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Removed);
			}

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
		 * Method used to set the tabindex attribute
		 *
		 * @memberof DropdownServerSideItem
		 */
		public setTabindex(): void {
			Helper.A11Y.TabIndexTrue(this.selfElement);
		}

		/**
		 * Method used to update the selected status
		 *
		 * @param triggerCallback True by default, used to block the callback when needed
		 * @memberof DropdownServerSideItem
		 */
		public toggleSelected(triggerCallback = true): void {
			// Update the Status value with the it's Toggled value
			this._updateSelectedStatus(!this.configs.IsSelected);

			if (triggerCallback) {
				// Trigger platform callback about Option has been selected!
				Helper.AsyncInvocation(
					this._platformEventOnClickCallback,
					this.parentObject.widgetId,
					this.configs.ItemId
				);
			}
		}

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof DropdownServerSideItem
		 */
		public unsetTabindex(): void {
			Helper.A11Y.TabIndexFalse(this.selfElement);
		}

		/**
		 * Getter that allows to obtain the IsSelectd status value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof DropdownServerSideItem
		 */
		public get IsSelected(): boolean {
			return this.configs.IsSelected;
		}

		/**
		 * Getter that allows to obtain the ItemId value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof DropdownServerSideItem
		 */
		public get ItemId(): string {
			return this.configs.ItemId;
		}
	}
}
