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
		private _eventOnkeyBoardPress: Callbacks.Generic;
		// Platform Click Event Callback
		private _platformEventOnClickCallback: Callbacks.OSDropdownServerSideItemOnSelectEvent;

		// Store the Key used to trigger the notification into Dropdown parent
		public keybordTriggerdKey: GlobalEnum.Keycodes;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new DropdownServerSideItemConfig(configs));
		}

		// A11y keyboard keys
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.preventDefault();
			event.stopPropagation();

			switch (event.key) {
				// If Snter or Space Keys trigger as a click event!
				case GlobalEnum.Keycodes.Enter:
				case GlobalEnum.Keycodes.Space:
					// Unset KeyCode
					this.keybordTriggerdKey = undefined;

					// Triggered as it was clicked!
					this._onSelected(event);
					break;

				// If ArrowUp or ArrowDown keys notify parent to move to prev/next option item!
				case GlobalEnum.Keycodes.ArrowUp:
				case GlobalEnum.Keycodes.ArrowDown:
					// Set KeyCode
					this.keybordTriggerdKey = event.key;

					// Notify parent about the selected key
					this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.KeyPressed);
					break;

				// If Tab!
				case GlobalEnum.Keycodes.Tab:
					// If Shift + Tab
					if (event.shiftKey) {
						// Set KeyCode
						this.keybordTriggerdKey = GlobalEnum.Keycodes.ShiftTab;
					} else {
						// Set KeyCode
						this.keybordTriggerdKey = GlobalEnum.Keycodes.Tab;
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
				event.type === 'click'
					? Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Click
					: Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.KeyPressed
			);

			// Trigger platform callback about Option has been selected!
			Helper.AsyncInvocation(this._platformEventOnClickCallback, this.parentObject.widgetId, this.configs.ItemId);
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
			Helper.A11Y.TabIndexFalse(this.selfElement);
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelected.bind(this);
			this._eventOnkeyBoardPress = this._onKeyboardPressed.bind(this);
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

			this.setParent(
				Constants.Dot + Enum.CssClass.DropdownParentBallon,
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
						Helper.Dom.Styles.ToggleClass(this.selfElement, Enum.CssClass.IsSelected);
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
			this.unsetCallbacks();

			this._removeEvents();

			// Notify parent about this instance will be destroyed
			this.notifyParent(Providers.Dropdown.OSUIComponents.Enum.ChildNotifyActionType.Removed);

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
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof DropdownServerSideItem
		 */
		public unsetTabindex(): void {
			Helper.A11Y.TabIndexFalse(this.selfElement);
		}
	}
}
