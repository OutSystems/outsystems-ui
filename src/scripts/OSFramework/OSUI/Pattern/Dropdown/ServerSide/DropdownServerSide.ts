// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSide
		extends Patterns.AbstractParent<
			OSUIDropdownServerSideConfig,
			Patterns.DropdownServerSideItem.IDropdownServerSideItem
		>
		implements IDropdownServerSide
	{
		// Store the HTML element for the DropdownBalloonContainer
		private _balloonContainerElement: HTMLElement;
		// Store the Balloon Element
		private _balloonElem: HTMLElement;
		// Store the Balloon Class instance
		private _balloonFeature: Feature.Balloon.IBalloon;
		// Store all the focusable elements inside footer if it's the case!
		private _balloonFocusableElemsInFooter: HTMLElement[];
		// Store the HTML element for the DropdownBalloonFooter
		private _balloonFooterElement: HTMLElement;
		// Store the BalloonOptions container AriaLabel text
		private _balloonOptionsAriaLabel: string;
		// Store the HTML element for the Dropdown otpions
		private _balloonOptionsWrapperElement: HTMLElement;
		// Store the HTML element for the Search input at Dropdown Balloon
		private _balloonSearchInputElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonSearch
		private _balloonSearchInputWrapperElement: HTMLElement;
		// Store a Flag property that will help dealing with the focus state at the close moment
		private _closeDynamically = false;
		// Custom Balloon Event
		private _eventBalloonOnToggle: GlobalCallbacks.Generic;
		// Click On Body
		private _eventOnBodyClick: GlobalCallbacks.Generic;
		// Click Event
		private _eventOnClick: GlobalCallbacks.Generic;
		private _eventOnClickInputSearch: GlobalCallbacks.Generic;
		// OnSearchInputBlur Event
		private _eventOnSearchInputBlur: GlobalCallbacks.Generic;
		// OnSearchInputFocus Event
		private _eventOnSearchInputFocus: GlobalCallbacks.Generic;
		// OnTouchMove Event at the balloon wrapper
		private _eventOnTouchMove: GlobalCallbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyboardPress: GlobalCallbacks.Generic;
		// Store the Element State, by default is closed!
		private _isOpen = false;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: GlobalCallbacks.OSGeneric;
		// Store the HTML element for the Dropdown Select Wrapper
		private _selectValuesWrapper: HTMLElement;
		// Store the SelectValuesWrapper AriaLabel text
		private _selectValuesWrapperAriaLabel: string;
		// Store the Balloon options to pass to the Balloon Class
		public balloonOptions: Feature.Balloon.BalloonOptions;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OSUIDropdownServerSideConfig(configs));
		}

		// Add error message container with a given text
		private _addErrorMessage(text: string): void {
			const errorMessageElement = Helper.Dom.ClassSelector(
				this.selfElement.parentElement,
				Enum.CssClass.ErrorMessage
			);

			// Check if the element already exist!
			if (errorMessageElement === undefined) {
				// Create the wrapper container
				const textContainer = document.createElement(GlobalEnum.HTMLElement.Div);
				textContainer.classList.add(Enum.CssClass.ErrorMessage);
				textContainer.innerHTML = text;

				this.selfElement.parentElement.appendChild(textContainer);
			}
		}

		// Method to handle the custom BalloonOnToggle callback
		private _balloonOnToggleCallback(_args: string, e: CustomEvent): void {
			// If the balloon closed is the one from this pattern, toggle the isOpen
			if (e.detail.balloonElem === this._balloonElem && e.detail.isOpen !== this._isOpen) {
				this._close(true);
			}
		}

		// Close the Balloon
		private _close(isFromBalloonEvent = false): void {
			if (this._isOpen === false) {
				return;
			}

			if (!isFromBalloonEvent) {
				this._balloonFeature.close();
			}

			// Update status property
			this._isOpen = false;

			// Update the touchMove when pattern is open!
			this._touchMove();
			// Update pattern status!
			this._updatePatternState();
			// Remove event listeners
			this._unsetEvents(true);
		}

		// Method that will return HasNoImplementation Error Info
		private _hasNoImplementation(): string {
			throw new Error(
				`${ErrorCodes.Dropdown.HasNoImplementation.code}: ${ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}

		// Method to move Balloon Options Wrapper to outside of the pattern context
		private _moveBalloonOptionsWrapper(): void {
			// Check if BalloonOptions should be moved outside of the pattern context
			if (this._shouldBalloonOptionsBeMoved()) {
				// Get the content element where to move the BalloonOptionsWrapper
				const contentElem = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.Content);
				// Move the DropdownServerSide ballon element to the content element
				Helper.Dom.Move(this._balloonElem, contentElem);
				// Add a custom css selector in order to style it at this new context
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._balloonElem, Enum.CssClass.HasBeenMovedToContent);
			}
		}

		// Close when click outside of pattern
		private _onBodyClick(eventName: string, event: PointerEvent): void {
			if (this._isOpen === false) {
				return;
			}

			this._closeDynamically = true;

			// Check if balloon can be closed
			// If it's phone, always close, as it is on popup mode
			// Also prevent closing when clicking at an element inside search icon placeholder
			const canClose =
				Helper.DeviceInfo.IsPhone &&
				(event.target as HTMLElement).closest(`.${Enum.CssClass.BalloonSearchIcon}`) === null;

			if (canClose) {
				this._close();
			}
		}

		// A11y keyboard keys
		private _onKeyboardPressed(event: KeyboardEvent): void {
			event.stopPropagation();

			// Check which element has been key pressed!
			switch (event.target) {
				// Check if the SelectValuesWrapper container has been pressed!
				case this._selectValuesWrapper:
					// If Escape Key
					if (event.key === GlobalEnum.Keycodes.Escape) {
						this._close();
					}

					// If Enter or Space Keys and Single Option
					if (
						event.key === GlobalEnum.Keycodes.Enter ||
						event.key === GlobalEnum.Keycodes.Space ||
						event.key === GlobalEnum.Keycodes.ArrowUp ||
						event.key === GlobalEnum.Keycodes.ArrowDown ||
						event.key === GlobalEnum.Keycodes.Home
					) {
						// Trigger the click in order to be captured also by DOM (body onClick) in order to close other Dropdowns in page if they are open!
						this._selectValuesWrapper.click();
					}

					break;

				// Check if the Balloon Options container has been pressed!
				case this._balloonOptionsWrapperElement:
					// If Escape Key
					if (event.key === GlobalEnum.Keycodes.Escape) {
						this._close();
					}

					// If ArrowDown Key
					if (event.key === GlobalEnum.Keycodes.ArrowUp) {
						// Check if search input exist
						if (this._balloonSearchInputElement) {
							this._balloonSearchInputElement.focus();
						}
					} else if (event.key === GlobalEnum.Keycodes.ArrowDown) {
						// If ArrowDown Key
						// Focus the first option item!
						event.preventDefault();
						this.getChildByIndex(0).setFocus();
						// Check if Dropdown should only allow single option selected
						if (this.configs.AllowMultipleSelection === false) {
							// Set also the first option item as IsSelected!
							this.getChildByIndex(0).toggleSelected();
						}
					}
					break;

				// Check if the input Search has been pressed!
				case this._balloonSearchInputElement:
					// If Escape Key
					if (event.key === GlobalEnum.Keycodes.Escape) {
						this._close();
					}
					break;
			}
		}

		// Also Used to manage the balloon height accordingly keyboard is in use due to the way iOS deal with it!
		private _onSearchInputBlur(): void {
			Helper.Dom.Styles.RemoveClass(this._balloonElem, Enum.CssClass.SearchInputIsFocused);
		}

		// Used to set a stopPropagation when click at search input
		private _onSearchInputClicked(event: MouseEvent): void {
			event.stopPropagation();
		}

		// Used to manage the balloon height accordingly keyboard is in use due to the way iOS deal with it!
		private _onSearchInputFocus(): void {
			Helper.Dom.Styles.AddClass(this._balloonElem, Enum.CssClass.SearchInputIsFocused);
		}

		// Used to apply the logic when user click to open the Dropdown
		private _onSelectValuesWrapperClicked(): void {
			// Ensure that dropdown can open or close
			this._isOpen ? this._close() : this._open();
		}

		// Manage the OnTouchMove action
		private _onTouchMove(event: TouchEvent): void {
			if (event.target === this._balloonElem) {
				event.preventDefault();
			}
		}

		// Open the Balloon
		private _open(): void {
			if (this._isOpen) {
				return;
			}
			this._balloonFeature.open(true);
			this._closeDynamically = false;
			this._isOpen = true;

			// Update the touchMove when pattern is open!
			this._touchMove();

			// Add the isVisible class to body
			Helper.Dom.Styles.AddClass(document.body, Enum.CssClass.IsVisible);
			this._updatePatternState();

			// Add event listeners
			Helper.AsyncInvocation(this._setUpEvents.bind(this));
		}

		// Method to deal with the click at a DropdpownOptionItem
		private _optionItemHasBeenClicked(optionItemId: string): void {
			const clickedItem = this.getChild(optionItemId);

			// Check if the given OptionId exist at optionsList
			if (clickedItem) {
				// Check if Dropdown should only allow single option selected
				if (this.configs.AllowMultipleSelection) {
					// Udpate the Option Item selected State!
					clickedItem.toggleSelected();
				}

				// Check if Dropdown should only allow single option selected
				if (this.configs.AllowMultipleSelection === false) {
					// Close the Dropdown!
					this._close();

					if (clickedItem.IsSelected === false) {
						clickedItem.toggleSelected();
					}
				}
			} else {
				throw new Error(
					`${ErrorCodes.Dropdown.FailOptionItemClicked}: The ${GlobalEnum.PatternName.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternName.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method used to deal with the keyPressed navigation between DropdownOptionItems
		private _optionItemKeyPressed(optionItemId: string): void {
			// Get the optionItem reference based on the given Id
			const optionItem = this.getChild(optionItemId);

			// Check if the given OptionId exist at optionsList
			if (optionItem !== undefined) {
				// Get the option item index position
				const getOptionItemIndex = this.getChildIndex(optionItemId);

				// Ensure that code wont run if key was not defined!
				if (optionItem.keyboardTriggeredKey === undefined) {
					return;
				}

				// Check which Keyboard key has been pressed
				switch (optionItem.keyboardTriggeredKey) {
					// If Enter or Space Keys trigger as a click event!
					case GlobalEnum.Keycodes.Enter:
					case GlobalEnum.Keycodes.Space:
						// Act like option item has been clicked!
						this._optionItemHasBeenClicked(optionItemId);
						break;

					// ArrowUp
					case GlobalEnum.Keycodes.ArrowUp:
						// Check If focused item is not the first one!
						if (getOptionItemIndex > 0) {
							this._updateOptionItemFocuStateOnKeyPress(optionItem, getOptionItemIndex - 1);
						}
						break;

					// ArrowDown
					case GlobalEnum.Keycodes.ArrowDown:
						if (getOptionItemIndex < this.getChildItems().length - 1) {
							this._updateOptionItemFocuStateOnKeyPress(optionItem, getOptionItemIndex + 1);
						}
						break;

					// Shift + Tab
					case GlobalEnum.Keycodes.ShiftTab:
						// Check if search input exist
						if (this._balloonSearchInputElement) {
							this._balloonSearchInputElement.focus();
						}
						break;

					// Tab
					case GlobalEnum.Keycodes.Tab:
						// Check if there are focusable elements inside footer
						if (this._balloonFocusableElemsInFooter.length > 0) {
							// Set focus the the first one
							this._balloonFocusableElemsInFooter[0].focus();
						}
						break;

					// Escape
					case GlobalEnum.Keycodes.Escape:
						// Close Dropdown
						this._close();
						break;
				}
			} else {
				throw new Error(
					`${ErrorCodes.Dropdown.FailOptionItemKeyPressed}: The ${GlobalEnum.PatternName.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternName.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method to call the Balloon Class
		private _setBalloonFeature(): void {
			this.setBalloonOptions();

			this._balloonFeature = new OSFramework.OSUI.Feature.Balloon.Balloon<IDropdownServerSide>(
				this,
				this._balloonElem,
				this.balloonOptions
			);

			// Call the method to move the Balloon Options Wrapper
			OSFramework.OSUI.Helper.AsyncInvocation(this._moveBalloonOptionsWrapper.bind(this));
		}

		// Method used to add CSS classes to pattern elements
		private _setCssClasses(): void {
			// If search input exist add a class to the balloon
			if (this._balloonSearchInputElement === undefined) {
				// Needed to style the balloon height once at phone
				Helper.Dom.Styles.AddClass(this._balloonElem, Enum.CssClass.BalloonHasNotSearchInput);
			}
		}

		// Method to set the initial options on screen load
		private _setInitialOptions(): void {
			if (this.configs.IsDisabled) {
				this.disable();
			}
		}

		// Method used to store a given DropdownOption into optionItems list, it's triggered by DropdownServerSideItem
		private _setNewOptionItem(optionItem: Patterns.DropdownServerSideItem.DropdownServerSideItem): void {
			// Check if the given OptionId has been already added
			if (this.getChild(optionItem.uniqueId)) {
				throw new Error(
					`${ErrorCodes.Dropdown.FailSetNewOptionItem}: There is already a ${GlobalEnum.PatternName.DropdownServerSideItem} under Id: '${optionItem.widgetId}' added to ${GlobalEnum.PatternName.Dropdown} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store DropDownOption Child Item
				this.setChild(optionItem);
			}
		}

		// Set Pattern Events
		private _setUpEvents(): void {
			// Add OnClick Event to the SelectValuesWrapper
			this._selectValuesWrapper.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			// Add KeyDown Event to the SelectValuesWrapper (A11y - stuff)
			this._selectValuesWrapper.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyboardPress);

			if (this.isBuilt) {
				// Add KeyDown Event to the BalloonContent (OptionsWrapper) (A11y - stuff)
				this._balloonOptionsWrapperElement.addEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyboardPress
				);
				// If search input exist (A11y - stuff)
				if (this._balloonSearchInputElement) {
					this._balloonSearchInputElement.addEventListener(
						GlobalEnum.HTMLEvent.Click,
						this._eventOnClickInputSearch
					);

					// Add keyPress event in order to capture Escape key
					this._balloonSearchInputElement.addEventListener(
						GlobalEnum.HTMLEvent.keyDown,
						this._eventOnkeyboardPress
					);
					// Add BlurEvent in order to manage the Balloon Height when at iOS due to keyboard is in use
					this._balloonSearchInputElement.addEventListener(
						GlobalEnum.HTMLEvent.Blur,
						this._eventOnSearchInputBlur
					);
					// Add FocusEvent in order to manage the Balloon Height when at iOS due to keyboard is in use
					this._balloonSearchInputElement.addEventListener(
						GlobalEnum.HTMLEvent.Focus,
						this._eventOnSearchInputFocus
					);
				}

				// Add the BodyClick callback that will be used Close open Dropdown!
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BodyOnClick,
					this._eventOnBodyClick
				);

				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BalloonOnToggle,
					this._eventBalloonOnToggle
				);
			}
		}

		// Method that will check if the BalloonOptionsWrapper should be moved outside of the pattern context
		private _shouldBalloonOptionsBeMoved(): boolean {
			/* NOTE:
				- When inside BottomSheet the BalloonOptionsWrapper should be moved to the content wrapper
				due to position issues related with fixed position of the balloon against BottomSheet fixed position.
				More info at Release Note: ROU-11549
			 */
			// Check if the DropdownServerSide is inside a BottomSheet, Notification, or Sidebar
			if (
				Helper.DeviceInfo.IsPhone &&
				(this.selfElement.closest(Enum.InsidePattern.BottomSheet) ||
					this.selfElement.closest(Enum.InsidePattern.Notification) ||
					this.selfElement.closest(Enum.InsidePattern.Sidebar))
			) {
				return true;
			} else {
				return false;
			}
		}

		// Method used to manage the onTouchMove when we're at mobile devices in order to block the window scroll!
		// This is an improvement specially to iOS since otherwise it will be able to scroll the pattern when keyboard is open!
		private _touchMove(): void {
			// Check if the used browser has TouchMove event and if it's an iOS device
			if (Helper.DeviceInfo.IsIos && 'ontouchmove' in window) {
				if (this._isOpen) {
					this._balloonElem.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._eventOnTouchMove);
				} else {
					this._balloonElem.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._eventOnTouchMove);
				}
			}
		}

		// Mehod used to trigger the _platformEventOnToggleCallback callback!
		private _triggerToogleCalbackEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggleCallback, this._isOpen);
		}

		// Remove Pattern Events
		private _unsetEvents(isUpdate = false): void {
			if (isUpdate === false) {
				this._selectValuesWrapper.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
				this._selectValuesWrapper.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyboardPress);
			}

			this._balloonOptionsWrapperElement.removeEventListener(
				GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyboardPress
			);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventOnBodyClick
			);
			if (this._balloonSearchInputElement) {
				this._balloonSearchInputElement.removeEventListener(
					GlobalEnum.HTMLEvent.Click,
					this._eventOnClickInputSearch
				);
				this._balloonSearchInputElement.removeEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyboardPress
				);
				this._balloonSearchInputElement.removeEventListener(
					GlobalEnum.HTMLEvent.Blur,
					this._eventOnSearchInputBlur
				);
				this._balloonSearchInputElement.removeEventListener(
					GlobalEnum.HTMLEvent.Focus,
					this._eventOnSearchInputFocus
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
					`${ErrorCodes.Dropdown.FailUnsetNewOptionItem}: The ${GlobalEnum.PatternName.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternName.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method that will be used to set/unset the TabIndex to the DropdownBallon elements according it's opened/closed
		private _updateBalloonAccessibilityElements(): void {
			const tabIndexValue = this._isOpen
				? Constants.A11YAttributes.States.TabIndexShow
				: Constants.A11YAttributes.States.TabIndexHidden;

			// If there is the Search input
			if (this._balloonSearchInputElement !== undefined) {
				Helper.A11Y.TabIndex(this._balloonSearchInputElement, tabIndexValue);
				Helper.A11Y.AriaHidden(
					this._balloonSearchInputElement,
					(tabIndexValue === Constants.A11YAttributes.States.TabIndexHidden).toString()
				);
			}

			// If there are items inside Ballon Footer
			if (this._balloonFocusableElemsInFooter.length > 0) {
				// Will handle the tabindex value of the elements inside pattern
				Helper.A11Y.SetElementsTabIndex(this._isOpen, this._balloonFocusableElemsInFooter);
			}

			// Ballon Options Wrapper
			Helper.A11Y.TabIndex(this._balloonOptionsWrapperElement, tabIndexValue);

			// If there are items inside Ballon Footer
			if (this._balloonFocusableElemsInFooter.length > 0) {
				// Will handle the tabindex value of the elements inside pattern
				Helper.A11Y.SetElementsTabIndex(this._isOpen, this._balloonFocusableElemsInFooter);
			}

			// Update FocusHTML elements attributes
			if (this._isOpen) {
				// Ballon Options Wrapper
				Helper.A11Y.AriaHiddenFalse(this._balloonOptionsWrapperElement);
			} else {
				// Remove a11y selector in order to grant it will be updated each time Balloon gets open
				Helper.Dom.Styles.RemoveClass(this._balloonElem, Constants.HasAccessibilityClass);
				// Ballon Options Wrapper
				Helper.A11Y.AriaHiddenTrue(this._balloonOptionsWrapperElement);
			}
		}

		// Method to (un)set option item focus statue
		private _updateOptionItemFocuStateOnKeyPress(
			optionItem: Patterns.DropdownServerSideItem.IDropdownServerSideItem,
			itemIndex: number
		): void {
			// Check if Dropdown should only allow single option selected!
			if (this.configs.AllowMultipleSelection === false) {
				// Unset IsSelected to the previous Item
				optionItem.toggleSelected();
				// Set IsSelected to the next item
				this.getChildByIndex(itemIndex).toggleSelected();
			}

			// Set Blur to the current one!
			optionItem.setBlur();
			// Set Focus to the prev/next one!
			this.getChildByIndex(itemIndex).setFocus();
		}

		// Method that will update the pattern state
		private _updatePatternState(): void {
			// Update the TabIndex for the items inside Balloon
			this._updateBalloonAccessibilityElements();

			// If balloon will open
			if (this._isOpen) {
				// Add IsOpened Class!
				Helper.Dom.Styles.AddClass(this._balloonElem, Enum.CssClass.IsOpened);

				// Check if inputSearch exist
				if (this._balloonSearchInputElement) {
					this._balloonSearchInputElement.focus();
				} else {
					this._balloonOptionsWrapperElement.focus();
				}
			} else {
				// Remove IsOpened Class
				Helper.Dom.Styles.RemoveClass(this._balloonElem, Enum.CssClass.IsOpened);

				// Check if the close will be done by logic instead of user interaction
				if (this._closeDynamically === false) {
					// Set focus to the base element
					this._selectValuesWrapper.focus();
				}
			}

			// Trigger the toggle callback event
			this._triggerToogleCalbackEvent();
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected setA11YProperties(): void {
			// Update Tabindex Ballon elements
			this._updateBalloonAccessibilityElements();

			// Enabled TabIndex to the SelectValuesWrapper
			Helper.A11Y.TabIndexTrue(this._selectValuesWrapper);
			// Set SelectValuesWrapper with button as a role
			Helper.A11Y.RoleButton(this._selectValuesWrapper);
			// Set SelectValuesWrapper with aria-haspopup='listbox'
			Helper.A11Y.AriaHasPopup(this._selectValuesWrapper, Constants.A11YAttributes.Aria.Haspopup.value.Listbox);
			// Set balloon option items container properties
			Helper.A11Y.RoleListbox(this._balloonOptionsWrapperElement);
			Helper.A11Y.TabIndexFalse(this._balloonOptionsWrapperElement);
			Helper.A11Y.AriaHiddenTrue(this._balloonOptionsWrapperElement);
			// Check if the Dropdown allow multiselect
			if (this.configs.AllowMultipleSelection) {
				// Set the aria-multiselectable attribute to the options wrapper element
				Helper.A11Y.MultiselectableTrue(this._balloonOptionsWrapperElement);
			}
			// Set Aria Label for the SelectValuesWrapper
			this.setSelectAriaLabel();
			// Set Aria Label for the BalloonOptionsWrapper
			this.setBalloonOptionsAriaLabel();
		}

		/**
		 * Method to set the calbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected setCallbacks(): void {
			this._eventOnBodyClick = this._onBodyClick.bind(this);
			this._eventBalloonOnToggle = this._balloonOnToggleCallback.bind(this);
			this._eventOnClick = this._onSelectValuesWrapperClicked.bind(this);
			this._eventOnClickInputSearch = this._onSearchInputClicked.bind(this);
			this._eventOnkeyboardPress = this._onKeyboardPressed.bind(this);
			this._eventOnSearchInputBlur = this._onSearchInputBlur.bind(this);
			this._eventOnSearchInputFocus = this._onSearchInputFocus.bind(this);
			this._eventOnTouchMove = this._onTouchMove.bind(this);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			this._balloonFooterElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonFooter);
			this._balloonFocusableElemsInFooter = Helper.Dom.TagSelectorAll(
				this._balloonFooterElement,
				Constants.FocusableElems
			);
			this._balloonSearchInputWrapperElement = Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.BalloonSearch
			);
			this._balloonSearchInputElement = Helper.Dom.TagSelector(
				this._balloonSearchInputWrapperElement,
				GlobalEnum.HTMLElement.Input
			);
			this._balloonContainerElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonContainer);
			this._balloonElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Balloon);
			this._balloonOptionsWrapperElement = Helper.Dom.ClassSelector(
				this._balloonElem,
				Enum.CssClass.BalloonContent
			);
			this._selectValuesWrapper = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.SelectValuesWrapper);
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected unsetCallbacks(): void {
			this._eventOnBodyClick = undefined;
			this._eventBalloonOnToggle = undefined;
			this._eventOnClick = undefined;
			this._eventOnClickInputSearch = undefined;
			this._eventOnkeyboardPress = undefined;
			this._eventOnSearchInputBlur = undefined;
			this._eventOnSearchInputFocus = undefined;
			this._eventOnTouchMove = undefined;
			this._platformEventOnToggleCallback = undefined;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected unsetHtmlElements(): void {
			// unset the local properties
			this._balloonContainerElement = undefined;
			this._balloonFocusableElemsInFooter = [];
			this._balloonFooterElement = undefined;
			this._balloonOptionsWrapperElement = undefined;
			this._balloonSearchInputElement = undefined;
			this._balloonSearchInputWrapperElement = undefined;
			this._balloonElem = undefined;
			this._selectValuesWrapper = undefined;
		}

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public beNotifiedByChild(
			childItem: Patterns.DropdownServerSideItem.DropdownServerSideItem,
			notifiedTo: Enum.ChildNotifyActionType
		): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this._setNewOptionItem(childItem);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._optionItemHasBeenClicked(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.KeyPressed:
					this._optionItemKeyPressed(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this._unsetNewOptionItem(childItem.uniqueId);
					break;
				default:
					throw new Error(
						`${ErrorCodes.Dropdown.FailToSetOptionItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		/**
		 * Method to build the DropdownServerSide
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public build(): void {
			super.build();
			this.setCallbacks();
			this.setHtmlElements();
			this.setA11YProperties();
			this._setUpEvents();
			this._setCssClasses();
			this._setInitialOptions();
			this._setBalloonFeature();
			this.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsDisabled:
						propertyValue ? this.disable() : this.enable();
						break;
				}
			}
		}

		/**
		 * Method that will check for all Selected OptionItems and Unselect them
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public clear(): void {
			// Get all Selected Items
			const selectedOptions = this.getChildItems().filter((item) => item.IsSelected);
			// Go through all the selected option items
			for (const optionItem of selectedOptions) {
				// Unselect it!
				optionItem.toggleSelected(false);
			}
		}

		/**
		 * Method used to close the Dropdown
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public close(): void {
			// SetTimeout is needed in order to ensure there is no conflit between OnClickBody and a button click that trigger this method.
			OSFramework.OSUI.Helper.AsyncInvocation(this._close.bind(this));
		}

		/**
		 * Set pattern with a disable status
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public disable(): void {
			// Assign disabled status.
			Helper.Dom.Attribute.Set(this.selfElement, GlobalEnum.HTMLAttributes.Disabled, '');
			// Assign IsDisabled class
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsDisabled);
			// Assign tabindex value on values wrapper
			Helper.A11Y.TabIndexFalse(this._selectValuesWrapper);
		}

		/**
		 * Destroy the Dropdown.
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public dispose(): void {
			this._unsetEvents();
			this._balloonFeature?.dispose();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		/**
		 * Remove disable status from
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public enable(): void {
			// Remove disabled status.
			Helper.Dom.Attribute.Remove(this.selfElement, GlobalEnum.HTMLAttributes.Disabled);
			// Remove IsDisabled class
			Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsDisabled);
			// Assign tabindex value on values wrapper
			Helper.A11Y.TabIndexTrue(this._selectValuesWrapper);
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public getSelectedValues(): string {
			return this._hasNoImplementation();
		}

		/**
		 * Method used to open the Dropdown
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public open(): void {
			// SetTimeout is needed in order to ensure there is no conflit between OnClickBody and a button click that trigger this method.
			OSFramework.OSUI.Helper.AsyncInvocation(this._open.bind(this));
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {GlobalCallbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggleCallback === undefined) {
						this._platformEventOnToggleCallback = callback;
					}
					break;

				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to set the Balloon options
		 *
		 * @param {Feature.Balloon.BalloonOptions} [balloonOptions]
		 * @memberof OSUIDropdownServerSide
		 */
		public setBalloonOptions(balloonOptions?: Feature.Balloon.BalloonOptions): void {
			if (balloonOptions !== undefined) {
				this.balloonOptions = balloonOptions;
			} else {
				// Set focus options to pass to the Balloon feature
				const _focusOptions = {
					elemToFocusOnOpen: this._selectValuesWrapper,
					useFocus: true,
					focusTrapParams: {
						focusBottomCallback: this.close.bind(this),
						focusTargetElement: this._balloonContainerElement,
						focusTopCallback: this.close.bind(this),
					},
				};

				this.balloonOptions = {
					alignment: GlobalEnum.FloatingAlignment.Start,
					anchorElem: this._selectValuesWrapper,
					allowedPlacements: [GlobalEnum.FloatingPosition.TopStart, GlobalEnum.FloatingPosition.BottomStart],
					position: GlobalEnum.FloatingPosition.Auto,
					shape: GlobalEnum.ShapeTypes.SoftRounded,
					focusOptions: _focusOptions,
					useTriggerWidth: true,
				};
			}
		}

		/**
		 * Method used to set the balloon AriaLabelText that will be applied to the balloon options container element
		 *
		 * @param value Text to be added
		 */
		public setBalloonOptionsAriaLabel(value?: string): void {
			this._balloonOptionsAriaLabel = value === undefined ? this.configs.balloonOptionsArialabel : value;
			Helper.A11Y.AriaLabel(this._balloonOptionsWrapperElement, this._balloonOptionsAriaLabel);
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public setProviderConfigs(): string {
			return this._hasNoImplementation();
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public setProviderEvent(): string {
			return this._hasNoImplementation();
		}

		/**
		 * Method used to set the AriaLabel text that will be applied to the SelectValuesWrapper "input" element
		 *
		 * @param value Text to be added
		 */
		public setSelectAriaLabel(value?: string): void {
			this._selectValuesWrapperAriaLabel =
				value === undefined ? this.configs.selectValuesWrapperAriaLabel : value;
			Helper.A11Y.AriaLabel(this._selectValuesWrapper, this._selectValuesWrapperAriaLabel);
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public unsetProviderEvent(): string {
			return this._hasNoImplementation();
		}

		/**
		 * Set the validation status, and also pass the message to show
		 *
		 * @param {boolean} Set if the dropdown is valid or not
		 * @param {string} Text message to be added
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		public validation(isValid: boolean, validationMessage: string): void {
			if (isValid === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.NotValid);
				this._addErrorMessage(validationMessage);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.NotValid);

				const errorMessageElement = Helper.Dom.ClassSelector(
					this.selfElement.parentElement,
					Enum.CssClass.ErrorMessage
				);

				// If error message has been added already, remove it!
				if (errorMessageElement) {
					errorMessageElement.remove();
				}
			}
		}
	}
}
