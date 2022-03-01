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
		// Store all the focusable elements inside footer if it's the case!
		private _balloonFocusableElemsInFooter: HTMLElement[];
		// Store the HTML element for the DropdownBalloonFooter
		private _balloonFooterElement: HTMLElement;
		// Store the HTML element for the Dropdown otpions
		private _balloonOptionsWrapperElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonSearch
		private _balloonSearchElement: HTMLElement;
		// Store the HTML element for the Search input at Dropdown Balloon
		private _balloonSearchInputElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonWrapper
		private _balloonWrapperElement: HTMLElement;
		// Click Event
		private _eventOnClick: OSUIFramework.Callbacks.Generic;
		// OnFocus Event at ballon custom span elements
		private _eventOnSpanFocus: OSUIFramework.Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyBoardPress: OSUIFramework.Callbacks.Generic;
		// Store the Element State, by default is closed!
		private _isOpened = false;
		// Platform OnInitialize Callback
		private _platformEventInitializedCallback: OSUIFramework.Callbacks.OSGeneric;
		// Platform OnClose Callback
		private _platformEventOnClosedCallback: OSUIFramework.Callbacks.OSGeneric;
		// Store the HTML element for the Dropdown Select Wrapper
		private _selectValuesWrapper: HTMLElement;
		// HTML Elements that will help to deal with keyboard tab navigation
		private _spanBottomFocusElement: HTMLElement;
		private _spanTopFocusElement: HTMLElement;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log('NEW', this.uniqueId);
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
			this._balloonWrapperElement.prepend(this._spanTopFocusElement);

			// Add bottom focus item
			this._spanBottomFocusElement = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Span);
			this._spanBottomFocusElement.classList.add(
				Enum.Class.FocusBottomHtmlElement,
				OSUIFramework.Constants.AccessibilityHideElementClass
			);
			OSUIFramework.Helper.A11Y.AriaHiddenTrue(this._spanBottomFocusElement);
			this._balloonWrapperElement.append(this._spanBottomFocusElement);
		}

		// Close the Balloon
		private _close(): void {
			// Set focus to the base element
			this._selectValuesWrapper.focus();
			// Update status property
			this._isOpened = false;
			// Update pattern status!
			this._updatePatternState();
		}

		// Move ballon element to outside of the pattern context
		private _moveBallonElement(): void {
			const layoutElement = OSUIFramework.Helper.Dom.TagSelector(
				document.body,
				OSUIFramework.Constants.Dot + OSUIFramework.Constants.LayoutClass
			) as HTMLElement;

			OSUIFramework.Helper.Dom.Move(this._balloonWrapperElement, layoutElement);
		}

		// A11y keyboard keys
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.stopPropagation();

			// Check which element has been pressed!
			switch (event.target) {
				// Check if the SelectValuesWrapper container has been pressed!
				case this._selectValuesWrapper:
					// If Escape Key
					if (event.key === OSUIFramework.GlobalEnum.Keycodes.Escape) {
						this._close();
					}

					// If Enter or Space Keys and Single Option
					if (
						event.key === OSUIFramework.GlobalEnum.Keycodes.Enter ||
						event.key === OSUIFramework.GlobalEnum.Keycodes.Space
					) {
						// Trigger the click in order to be captured also by DOM (body onClick) in order to close other Dropdowns in page if they are open!
						this._selectValuesWrapper.click();
					}
					break;

				// Check if the Balloon Options container has been pressed!
				case this._balloonOptionsWrapperElement:
					// If Escape Key
					if (event.key === OSUIFramework.GlobalEnum.Keycodes.Escape) {
						this._close();
					}

					// If ArrowDown Key
					if (event.key === OSUIFramework.GlobalEnum.Keycodes.ArrowUp) {
						// Check if search input exist
						if (this._balloonSearchInputElement) {
							this._balloonSearchInputElement.focus();
						} else {
							this._spanTopFocusElement.focus();
						}
					} else if (event.key === OSUIFramework.GlobalEnum.Keycodes.ArrowDown) {
						// If ArrowDown Key
						// Focus the first option item!
						this.getChildByIndex(0).setFocus();
					}
					break;

				// Check if the input Search has been pressed!
				case this._balloonSearchInputElement:
					// If Escape Key
					if (event.key === OSUIFramework.GlobalEnum.Keycodes.Escape) {
						this._close();
					}
					break;
			}
		}

		// Used to apply the logic when user click to open the Dropdown
		private _onSelectValuesWrapperClicked() {
			this._isOpened ? this._close() : this._open();
		}

		// Manage the behaviour to leave balloon using tabNavigation
		private _onSpanElementFocus(): void {
			// Close the Balloon
			this._close();
		}

		// Open the Balloon
		private _open(): void {
			this._isOpened = true;

			this._updatePatternState();
		}

		// Method to deal with the click at a DropdpownOptionItem
		private _optionItemHasBeenClicked(optionItemId: string): void {
			const clickedItem = this.getChild(optionItemId);

			// Check if the given OptionId exist at optionsList
			if (clickedItem) {
				// Udpate the Option Item selected State!
				clickedItem.updateSelected();
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

				// Check which Keyboard key has been pressed
				switch (optionItem.keybordTriggerdKey) {
					// If Enter or Space Keys trigger as a click event!
					case OSUIFramework.GlobalEnum.Keycodes.Enter:
					case OSUIFramework.GlobalEnum.Keycodes.Space:
						// Act like option item has been clicked!
						this._optionItemHasBeenClicked(optionItemId);
						break;

					// ArrowUp
					case OSUIFramework.GlobalEnum.Keycodes.ArrowUp:
						// Check If focused item is not the first one!
						if (getOptionItemIndex > 0) {
							this._updateOptionItemFocuStateOnKeyPress(optionItem, getOptionItemIndex - 1);
						}
						break;

					// ArrowDown
					case OSUIFramework.GlobalEnum.Keycodes.ArrowDown:
						if (getOptionItemIndex < this.childItems.length - 1) {
							this._updateOptionItemFocuStateOnKeyPress(optionItem, getOptionItemIndex + 1);
						}
						break;

					// Shift + Tab
					case OSUIFramework.GlobalEnum.Keycodes.ShiftTab:
						// Check if search input exist
						if (this._balloonSearchInputElement) {
							this._balloonSearchInputElement.focus();
						} else {
							this._spanTopFocusElement.focus();
						}
						break;

					// Tab
					case OSUIFramework.GlobalEnum.Keycodes.Tab:
						// Check if there are focusable elements inside footer
						if (this._balloonFocusableElemsInFooter.length > 0) {
							// Set focus the the first one
							this._balloonFocusableElemsInFooter[0].focus();
						} else {
							this._spanBottomFocusElement.focus();
						}
						break;

					// Escape
					case OSUIFramework.GlobalEnum.Keycodes.Escape:
						// Close Dropdown
						this._close();
						break;
				}
			} else {
				throw new Error(
					`${OSUIFramework.ErrorCodes.Dropdown.FailOptionItemKeyPressed}: The ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${OSUIFramework.GlobalEnum.PatternsNames.Dropdown} with Id: ${this.widgetId}.`
				);
			}
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
			// Add OnClick Event to the SelectValuesWrapper
			this._selectValuesWrapper.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			// Add KeyDown Event to the SelectValuesWrapper (A11y - stuff)
			this._selectValuesWrapper.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyBoardPress
			);
			// Add KeyDown Event to the BalloonContent (OptionsWrapper) (A11y - stuff)
			this._balloonOptionsWrapperElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyBoardPress
			);
			// Add Focus Event to the added Top Span Element (A11y - stuff)
			this._spanTopFocusElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
			// Add Focus Event to the added Bottom Span Element (A11y - stuff)
			this._spanBottomFocusElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.Focus,
				this._eventOnSpanFocus
			);
			// If search input exist
			if (this._balloonSearchInputElement) {
				// Add keyPress event
				this._balloonSearchInputElement.addEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyBoardPress
				);
			}
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this._selectValuesWrapper.removeEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selectValuesWrapper.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyBoardPress
			);
			this._balloonOptionsWrapperElement.removeEventListener(
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
			if (this._balloonSearchInputElement) {
				this._balloonSearchInputElement.removeEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyBoardPress
				);
			}
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

		// Method that will be used to set/unset the TabIndex to the DropdownBallon elements according it's opened/closed
		private _updateBallonElementsTabIndex(): void {
			const tabIndexValue = this._isOpened ? '0' : '-1';

			// If there is the Search input
			if (this._balloonSearchInputElement !== undefined) {
				OSUIFramework.Helper.A11Y.TabIndex(this._balloonSearchInputElement, tabIndexValue);
			}

			// Added SpanElements at Balloon Top and Bottom
			OSUIFramework.Helper.A11Y.TabIndex(this._spanBottomFocusElement, tabIndexValue);
			OSUIFramework.Helper.A11Y.TabIndex(this._spanTopFocusElement, tabIndexValue);

			// Ballon Options Wrapper
			OSUIFramework.Helper.A11Y.TabIndex(this._balloonOptionsWrapperElement, tabIndexValue);

			// If there are items inside Ballon Footer
			if (this._balloonFocusableElemsInFooter.length > 0) {
				for (const item of this._balloonFocusableElemsInFooter) {
					OSUIFramework.Helper.A11Y.TabIndex(item, tabIndexValue);
				}
			}
		}

		// Method to (un)set option item focus statue
		private _updateOptionItemFocuStateOnKeyPress(
			optionItem: OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem,
			itemIndex: number
		): void {
			// Set Blur to the current one!
			optionItem.setBlur();
			// Set Focus to the prev/next one!
			this.getChildByIndex(itemIndex).setFocus();
		}

		// Method that will update the pattern state
		private _updatePatternState(): void {
			// Update the TabIndex for the items inside Balloon
			this._updateBallonElementsTabIndex();

			// If balloon will open
			if (this._isOpened) {
				// Add IsOpend Class!
				OSUIFramework.Helper.Dom.Styles.AddClass(this.selfElement, Enum.Class.IsOpened);
				OSUIFramework.Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Enum.Class.IsOpened);

				// Check if inputSearch exist
				if (this._balloonSearchInputElement) {
					this._balloonSearchInputElement.focus();
				} else {
					this._balloonOptionsWrapperElement.focus();
				}
			} else {
				// Remove IsOpend Class!
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.Class.IsOpened);
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, Enum.Class.IsOpened);
			}
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setA11yProperties(): void {
			// Update Tabindex Ballon elements
			this._updateBallonElementsTabIndex();
			// Enabled TabIndex to the SelectValuesWrapper
			OSUIFramework.Helper.A11Y.TabIndexTrue(this._selectValuesWrapper);
			// Set SelectValuesWrapper with button as a role
			OSUIFramework.Helper.A11Y.RoleButton(this._selectValuesWrapper);
			// Set SelectValuesWrapper with aria-haspopup='listbox'
			OSUIFramework.Helper.A11Y.AriaHasPopup(
				this._selectValuesWrapper,
				OSUIFramework.Constants.A11YAttributes.Role.Listbox
			);
			// Set balloon option items container with listbox as a role
			OSUIFramework.Helper.A11Y.RoleListox(this._balloonOptionsWrapperElement);
			// Check if the Dropdown allow multiselect
			if (this.configs.AllowMultipleSelection) {
				// Set the aria-multiselectable attribute to the options wrapper element
				OSUIFramework.Helper.A11Y.MultiselectableTrue(this._balloonOptionsWrapperElement);
			}
		}

		/**
		 * Method to set the calbacks
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onSelectValuesWrapperClicked.bind(this);
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
			this._balloonFooterElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BalloonFooter
			);
			this._balloonFocusableElemsInFooter = OSUIFramework.Helper.Dom.TagSelectorAll(
				this._balloonFooterElement,
				OSUIFramework.Constants.FocusableElems
			);
			this._balloonSearchElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BalloonSearch
			);
			this._balloonSearchInputElement = OSUIFramework.Helper.Dom.TagSelector(
				this._balloonSearchElement,
				OSUIFramework.GlobalEnum.HTMLElement.Input
			);
			this._balloonWrapperElement = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.BalloonWrapper
			);
			this._balloonOptionsWrapperElement = OSUIFramework.Helper.Dom.TagSelector(
				this._balloonWrapperElement,
				OSUIFramework.Constants.Dot + Enum.Class.BalloonContent
			);
			this._selectValuesWrapper = OSUIFramework.Helper.Dom.TagSelector(
				this.selfElement,
				OSUIFramework.Constants.Dot + Enum.Class.SelectValuesWrapper
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
			this._eventOnSpanFocus = undefined;
			this._platformEventInitializedCallback = undefined;
			this._platformEventOnClosedCallback = undefined;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected unsetHtmlElements(): void {
			// Ensure that the ballon has been removed from the DOM since it has been Moved to outside of pattern context.
			this._balloonWrapperElement.remove();

			// unset the local properties
			this._balloonFocusableElemsInFooter = [];
			this._balloonFooterElement = undefined;
			this._balloonOptionsWrapperElement = undefined;
			this._balloonSearchElement = undefined;
			this._balloonSearchInputElement = undefined;
			this._balloonWrapperElement = undefined;
			this._selectValuesWrapper = undefined;
		}

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof OSUIDropdownServerSide
		 */
		public beNotifiedByChild(childId: string, notifiedTo: Enum.ChildNotifyActionType): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this._setNewOptionItem(childId);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._optionItemHasBeenClicked(childId);
					break;
				case Enum.ChildNotifyActionType.KeyPressed:
					this._optionItemKeyPressed(childId);
					break;
				case Enum.ChildNotifyActionType.Removed:
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

			console.log('To REMOVE! - document.body.classList.add("has-accessible-features2);');
			document.body.classList.add('has-accessible-features');
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUIDropdownServerSide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			console.log(this.uniqueId + ' DropdownServerSide - changeProperty()');

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
			console.log(this.uniqueId + ' DropdownServerSide - disable()');
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public dispose(): void {
			this._unsetEvents();
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
			console.log(this.uniqueId + ' DropdownServerSide - enable()');
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
