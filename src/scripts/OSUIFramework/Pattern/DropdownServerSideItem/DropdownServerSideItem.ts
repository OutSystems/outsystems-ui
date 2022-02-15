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
		// Click Event
		private _eventOnClick: Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyBoardPress: Callbacks.Generic;
		// Platform Click Event Callback
		private _platformEventOnClickCallback: Callbacks.OSDropdownServerSideItemOnSelectEvent;

		// Store the Key used to trigger the notification into Dropdown parent
		public keybordTriggerdKey: GlobalEnum.Keycodes;
		// Store a reference to the Dropdpown parent Element
		public parentElement: HTMLElement;
		// Store the id of of the Dropdown parent
		public parentId: string;
		// Store a reference to item Dropdpwn parent Element
		public parentObject: Providers.Dropdown.OSUIComponents.IDropdownServerSide;

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
					this.notifyParent(GlobalEnum.ChildNotifyActionParent.KeyPressed);
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
					this.notifyParent(GlobalEnum.ChildNotifyActionParent.KeyPressed);
					break;
			}
		}

		// Trigger the platform callback method
		private _onSelected(event: MouseEvent | KeyboardEvent): void {
			event.stopPropagation();

			// Notify parent about this Option Click
			this.notifyParent(
				event.type === 'click'
					? GlobalEnum.ChildNotifyActionParent.Click
					: GlobalEnum.ChildNotifyActionParent.KeyPressed
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
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof DropdownServerSideItem
		 */
		protected unsetHtmlElements(): void {
			this.parentElement = undefined;
			this.parentId = undefined;
			this.parentObject = undefined;
		}

		/**
		 *  Builds the DropdownServerSideItem.
		 *
		 * @memberof DropdownServerSideItem
		 */
		public build(): void {
			super.build();

			this.checkForParentId();

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
		 * Function used to get the reference of Dropdown parent and set it
		 *
		 * @memberof DropdownServerSideItem
		 */
		public checkForParentId(): void {
			try {
				const dropdownParentBallonElement = this._selfElem.closest(
					Constants.Dot + Enum.CssClass.DropdownParentBallon
				) as HTMLElement;

				this.parentId = dropdownParentBallonElement.dataset.dropdownUniqueid;
			} catch (e) {
				// Was not able to get Dropdown parent element!
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(GlobalEnum.ChildNotifyActionParent.Add);
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
			this.notifyParent(GlobalEnum.ChildNotifyActionParent.Removed);

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Method used to notify parent about the action that was performed
		 *
		 * @param actionType Action Type name
		 * @memberof IPatternIsPatternChild
		 */
		public notifyParent(actionType: GlobalEnum.ChildNotifyActionParent): void {
			// Get the Dropdown parent HTML element
			this.parentElement = Helper.Dom.GetElementByUniqueId(this.parentId);

			// If Dropdown Exist at Dom
			if (this.parentElement !== undefined) {
				// Get the DropdownParent reference
				this.parentObject = OutSystems.OSUI.Patterns.DropdownAPI.GetDropdownById(
					this.parentId
				) as Providers.Dropdown.OSUIComponents.IDropdownServerSide;

				// Trigger the notification into parent
				this.parentObject.beNotifiedByChild(this.uniqueId, actionType);
			} else if (GlobalEnum.ChildNotifyActionParent.Add) {
				throw new Error(
					`${ErrorCodes.DropdownServerSideItem.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}
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
