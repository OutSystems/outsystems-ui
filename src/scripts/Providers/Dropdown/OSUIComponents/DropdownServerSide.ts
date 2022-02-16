// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSide<C extends Dropdown.OSUIComponents.OSUIDropdownServerSideConfig>
		extends OSUIFramework.Patterns.AbstractParent<
			Dropdown.OSUIComponents.OSUIDropdownServerSideConfig,
			OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		>
		implements IDropdownServerSide
	{
		// Store the HTML element for the DropdownBaloonFooter
		private _baloonFooterElement: HTMLElement;
		// Store the HTML element for the DropdownBaloonSearch
		private _baloonSearchElement: HTMLElement;
		// Store the HTML element for the DropdownBaloonWrapper
		private _baloonWrapperElement: HTMLElement;
		// Click Event
		private _eventOnClick: OSUIFramework.Callbacks.Generic;
		// OnFocus Event at ballon custom span elements
		private _eventOnSpanFocus: OSUIFramework.Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyBoardPress: OSUIFramework.Callbacks.Generic;
		// Platform OnInitialize Callback
		private _platformEventInitializedCallback: OSUIFramework.Callbacks.OSGeneric;
		// Platform OnClose Callback
		private _platformEventOnClosedCallback: OSUIFramework.Callbacks.OSGeneric;
		// Store the HTML element for the Dropdown Select Wrapper
		private _selectWrapper: HTMLElement;
		// HTML Elements that will help to deal with keyboard tab navigation
		private _spanBottomFocusElement: HTMLElement;
		private _spanTopFocusElement: HTMLElement;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log('NEW DropdownSS', this.uniqueId);
		}

		// Add Custom HTML elements to the DropdownBallon in order to help on deal with keyboard navigation (Accessibility)
		private _addSpanHtmlElements(): void {
			// Add top focus item
			this._spanTopFocusElement = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Span);
			this._spanTopFocusElement.classList.add(
				Enum.Class.FocusTopHtmlElement,
				OSUIFramework.Constants.AccessibilityHideElementClass
			);
			OSUIFramework.Helper.A11Y.AriaHiddenFalse(this._spanTopFocusElement);
			this._baloonWrapperElement.prepend(this._spanTopFocusElement);

			// Add bottom focus item
			this._spanBottomFocusElement = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Span);
			this._spanBottomFocusElement.classList.add(
				Enum.Class.FocusBottomHtmlElement,
				OSUIFramework.Constants.AccessibilityHideElementClass
			);
			OSUIFramework.Helper.A11Y.AriaHiddenTrue(this._spanBottomFocusElement);
			this._baloonWrapperElement.append(this._spanBottomFocusElement);
		}

		// Move ballon element to outside of the pattern context
		private _moveBallonElement(): void {
			const layoutElement = OSUIFramework.Helper.Dom.TagSelector(
				document.body,
				OSUIFramework.Constants.Dot + OSUIFramework.Constants.LayoutClass
			) as HTMLElement;

			OSUIFramework.Helper.Dom.Move(this._baloonWrapperElement, layoutElement);
		}

		// A11y keyboard keys
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.stopPropagation();

			// If Enter or Space Keys and Single Option
			if (
				(event.key === OSUIFramework.GlobalEnum.Keycodes.Enter ||
					event.key === OSUIFramework.GlobalEnum.Keycodes.Space) &&
				this.configs.AllowMultipleSelection === false
			) {
				console.log('Dropdown must CLOSE!');
			}
		}

		// Used to apply the logic when user click to open the Dropdown
		private _onSelectWrapperClicked() {
			console.log('Dropdown must OPEN!');
		}

		// Manage the behaviour to leave baloon using tabNavigation
		private _onSpanElementFocus(event: FocusEvent): void {
			const targetElement = event.target as HTMLElement;
			targetElement.blur();

			this._baloonWrapperElement.focus();

			console.log('Dropdown must CLOSE!');
		}

		// Method to deal with the click at a DropdpownOptionItem
		private _optionItemHasBeenClicked(optionItemId: string): void {
			// Check if the given OptionId exist at optionsList
			if (this.getChild(optionItemId)) {
				// Check if Dropdown must close!
				if (this.configs.AllowMultipleSelection === false) {
					console.log('Dropdown must CLOSE!');
				}
			} else {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailOptionItemClicked}: The ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method used to deal with the keyPressed naviagtion between DropdownOptionItems
		private _optionItemKeyPressed(optionItemId: string): void {
			// Get the optionItem reference based on the given Id
			const optionItem = this.getChild(optionItemId);

			// Check if the given OptionId exist at optionsList
			if (optionItem !== undefined) {
				// Get the option item index position
				const getOptionItemIndex = this.getChildIndex(optionItemId);

				// Ensure that code wont run if key was not defined!
				if (optionItem.keybordTriggerdKey === undefined) {
					return;
				}

				switch (optionItem.keybordTriggerdKey) {
					// ArrowUp
					case OSUIFramework.GlobalEnum.Keycodes.ArrowUp:
						// Check If focused item is not the first one!
						if (getOptionItemIndex > 0) {
							this._updateOptionItemFocuState(optionItem, getOptionItemIndex - 1);
						}
						break;

					// ArrowDown
					case OSUIFramework.GlobalEnum.Keycodes.ArrowDown:
						if (getOptionItemIndex < this.childItems.length - 1) {
							this._updateOptionItemFocuState(optionItem, getOptionItemIndex + 1);
						}
						break;

					// Shift + Tab
					case OSUIFramework.GlobalEnum.Keycodes.ShiftTab:
						console.log('Move Out to Top!');
						break;

					// Tab
					case OSUIFramework.GlobalEnum.Keycodes.Tab:
						console.log('Move Out to Bottom!');
						break;
				}
			} else {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailOptionItemKeyPressed}: The ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this._selectWrapper.removeEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selectWrapper.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyBoardPress
			);
			this._spanTopFocusElement.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
			this._spanBottomFocusElement.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
		}

		// Method used to store a given DropdownOption into optionItems list, it's triggered by DropdownServerSideItem
		private _setNewOptionItem(optionItemId: string): void {
			// Get the DropdownOptionItem reference
			const optionItem =
				OutSystems.OSUI.Patterns.DropdownServerSideItemAPI.GetDropdownServerSideItemItemById(optionItemId);

			// Check if the given OptionId has been already added
			if (this.getChild(optionItemId)) {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailSetNewOptionItem}: There is already a ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under Id: '${optionItem.widgetId}' added to ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store DropDownOption Item
				this.setChild(optionItemId, optionItem);
			}
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			this._selectWrapper.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selectWrapper.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyBoardPress
			);
			this._spanTopFocusElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
			this._spanBottomFocusElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
		}

		// Method used to remove a given DropdownOption from optionItems list, it's triggered by DropdownServerSideItem
		private _unsetNewOptionItem(optionItemId: string): void {
			// Check if the given OptionId exist at optionsList
			if (this.getChild(optionItemId)) {
				// Remove item
				this.unsetChild(optionItemId);
			} else {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailUnsetNewOptionItem}: The ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method to (un)set option item focus statue
		private _updateOptionItemFocuState(
			optionItem: OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem,
			itemIndex: number
		): void {
			// Set Blur to the current one!
			optionItem.setBlur();
			// Set Focus to the prev/next one!
			this.getChildByIndex(itemIndex).setFocus();
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setA11yProperties(): void {
			OSUIFramework.Helper.A11Y.TabIndexTrue(this._spanBottomFocusElement);
			OSUIFramework.Helper.A11Y.TabIndexTrue(this._spanTopFocusElement);

			OSUIFramework.Helper.A11Y.TabIndexTrue(this._selectWrapper);
		}

		/**
		 * Method to set the calbacks
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelectWrapperClicked.bind(this);
			this._eventOnkeyBoardPress = this._onKeyboardPressed.bind(this);
			this._eventOnSpanFocus = this._onSpanElementFocus.bind(this);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			this._baloonFooterElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BallonFooter
			);
			this._baloonSearchElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BallonSearch
			);
			this._baloonWrapperElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BallonWrapper
			);
			this._selectWrapper = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.SelectWrapper
			);

			// Add custom SPAN HTML
			this._addSpanHtmlElements();
			// Add Accessibility properties
			this.setA11yProperties();
			// Add the pattern Events
			this._setUpEvents();
			// Ensure that the Move only happens after HTML elements has been set!
			this._moveBallonElement();

			// Trigger platform's _platformEventInitializedCallback client Action
			OSUIFramework.Helper.AsyncInvocation(this._platformEventInitializedCallback, this.widgetId);
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected unsetCallbacks(): void {
			this._platformEventInitializedCallback = undefined;
			this._platformEventOnClosedCallback = undefined;
			this._eventOnSpanFocus = undefined;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected unsetHtmlElements(): void {
			// Ensure that the ballon has been removed from the DOM since it has been Moved to outside of pattern context.
			this._baloonWrapperElement.remove();

			// unset the local properties
			this._baloonFooterElement = undefined;
			this._baloonSearchElement = undefined;
			this._baloonWrapperElement = undefined;
			this._selectWrapper = undefined;
		}

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {OSUIFramework.GlobalEnum.ChildNotifyActionParent} triggered notification type
		 * @memberof OSUIDropdownServerSide
		 */
		public beNotifiedByChild(childId: string, notifiedTo: OSUIFramework.GlobalEnum.ChildNotifyActionParent): void {
			switch (notifiedTo) {
				case OSUIFramework.GlobalEnum.ChildNotifyActionParent.Add:
					this._setNewOptionItem(childId);
					break;
				case OSUIFramework.GlobalEnum.ChildNotifyActionParent.Click:
					this._optionItemHasBeenClicked(childId);
					break;
				case OSUIFramework.GlobalEnum.ChildNotifyActionParent.KeyPressed:
					this._optionItemKeyPressed(childId);
					break;
				case OSUIFramework.GlobalEnum.ChildNotifyActionParent.Removed:
					this._unsetNewOptionItem(childId);
					break;
				default:
					throw new Error(
						`${OSUIFramework.ErrorCodes.Dropdown.FailToSetOptionItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		public build(): void {
			super.build();
			this.setCallbacks();
			this.setHtmlElements();
			super.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUIDropdownServerSide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// console.log(this.uniqueId + ' DropdownServerSide - changeProperty()');

			super.changeProperty(propertyName, propertyValue);

			// if (this.isBuilt) {
			// 	switch (propertyName) {
			// 		case OSUIFramework.Patterns.Dropdown.Enum.Properties.PROP_NAME:
			// 			// TODO (by CreateNewPattern): Update or Remove
			// 			break;
			// 	}
			// }
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public clear(): void {
			throw new Error(
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}

		/**
		 * Set pattern with a disable status
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public disable(): void {
			// console.log(this.uniqueId + ' DropdownServerSide - disable()');
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public dispose(): void {
			this._removeEvents();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		/**
		 * Remove disable status from
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public enable(): void {
			// console.log(this.uniqueId + ' DropdownServerSide - enable()');
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public getSelectedValues(): string {
			throw new Error(
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSUIDropdownServerSide
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.Dropdown.Enum.Events.Initialized:
					if (this._platformEventInitializedCallback === undefined) {
						this._platformEventInitializedCallback = callback;
					}
					break;

				case Enum.Events.OnClosed:
					if (this._platformEventOnClosedCallback === undefined) {
						this._platformEventOnClosedCallback = callback;
					}
					break;

				default:
					throw new Error(
						`${OSUIFramework.ErrorCodes.Dropdown.FailRegisterCallback}:	The given '${eventName}' event name it's not defined.`
					);
			}
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validation(isValid: boolean, validationMessage: string): void {
			throw new Error(
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}
	}
}
