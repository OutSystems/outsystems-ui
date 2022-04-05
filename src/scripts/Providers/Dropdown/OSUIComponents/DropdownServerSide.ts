// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.OSUIComponents {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSide
		extends OSUIFramework.Patterns.AbstractParent<
			Dropdown.OSUIComponents.OSUIDropdownServerSideConfig,
			OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		>
		implements IDropdownServerSide
	{
		// Store the HTML element for the DropdownBalloonContainer
		private _balloonContainerElement: HTMLElement;
		// Store all the focusable elements inside footer if it's the case!
		private _balloonFocusableElemsInFooter: HTMLElement[];
		// Store the HTML element for the DropdownBalloonFooter
		private _balloonFooterElement: HTMLElement;
		// Store the HTML element for the Dropdown otpions
		private _balloonOptionsWrapperElement: HTMLElement;
		// Store the balloon position when/if a recomended position has been added!
		private _balloonPositionClass = '';
		// Store the HTML element for the Search input at Dropdown Balloon
		private _balloonSearchInputElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonSearch
		private _balloonSearchInputWrapperElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonWrapper
		private _balloonWrapperElement: HTMLElement;
		// Store a Flag property that will help dealing with the focus state at the close moment
		private _closeDynamically = false;
		// Click On Body
		private _eventOnBodyClick: OSUIFramework.Callbacks.Generic;
		// Event OnBodyScroll
		private _eventOnBodyScroll: OSUIFramework.Callbacks.Generic;
		// Click Event
		private _eventOnClick: OSUIFramework.Callbacks.Generic;
		private _eventOnClickInputSearch: OSUIFramework.Callbacks.Generic;
		// Event OnTransitionEnd applied to the Balloon
		private _eventOnCloseTransitionEnd: OSUIFramework.Callbacks.Generic;
		// OnFocus Event at ballon custom span elements
		private _eventOnSpanFocus: OSUIFramework.Callbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: OSUIFramework.Callbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyboardPress: OSUIFramework.Callbacks.Generic;
		// Store a Flag property that will control if the dropdown is blocked (like it's under closing animation)
		private _isBlocked = false;
		// Store the Element State, by default is closed!
		private _isOpened = false;
		// Platform OnInitialize Callback
		private _platformEventInitializedCallback: OSUIFramework.Callbacks.OSGeneric;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: OSUIFramework.Callbacks.OSGeneric;
		// Store the HTML element for the Dropdown Select Wrapper
		private _selectValuesWrapper: HTMLElement;
		// HTML Elements that will help to deal with keyboard tab navigation (A11y - stuff)
		private _spanBottomFocusElement: HTMLElement;
		private _spanTopFocusElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OSUIDropdownServerSideConfig(configs));
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

		// Add Custom HTML elements to the DropdownBallon in order to help on deal with keyboard navigation (Accessibility)
		private _addSpanHtmlElements(): void {
			// Add top focus item
			this._spanTopFocusElement = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Span);
			this._spanTopFocusElement.classList.add(
				Enum.CssClass.FocusTopHtmlElement,
				OSUIFramework.Constants.AccessibilityHideElementClass
			);
			this._balloonWrapperElement.prepend(this._spanTopFocusElement);
			OSUIFramework.Helper.A11Y.AriaHiddenTrue(this._spanTopFocusElement);

			// Add bottom focus item
			this._spanBottomFocusElement = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Span);
			this._spanBottomFocusElement.classList.add(
				Enum.CssClass.FocusBottomHtmlElement,
				OSUIFramework.Constants.AccessibilityHideElementClass
			);
			this._balloonWrapperElement.append(this._spanBottomFocusElement);
			OSUIFramework.Helper.A11Y.AriaHiddenTrue(this._spanBottomFocusElement);
		}

		// Remove the position if has been already set
		private _cleanPosition(): void {
			// If there was an old position, remove it!
			if (this._balloonPositionClass !== '') {
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, this._balloonPositionClass);
				this._balloonPositionClass = '';
			}
		}

		// Close the Balloon
		private _close(): void {
			// Check if the close will be done by logic instead of user interaction
			if (this._closeDynamically === false) {
				// Set focus to the base element
				this._selectValuesWrapper.focus();
			}

			// Update status property
			this._isOpened = false;
			// Update pattern status!
			this._updatePatternState();
		}

		// Update stuff at end of close animation
		private _endOfCloseAnimation(): void {
			// Remove the TransitionEnd event
			this._balloonWrapperElement.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnCloseTransitionEnd
			);

			// If there was an old position, remove it
			this._cleanPosition();

			// Since animation already ended let's unblock the pattern to be possible open it again
			this._isBlocked = false;

			// Trigger the toggle callback event
			this._triggerToogleCalbackEvent();
		}

		// Check the recomended position to open the balloon
		private _getRecomendedPosition(): void {
			// Get the Boundaries for the balloon container
			const balloonBounds = this._balloonContainerElement.getBoundingClientRect();
			balloonBounds.height = this.configs.balloonMaxHeight;

			// Get the recomended position to open the balloon
			const recomendedPosition = OSUIFramework.Helper.BoundPosition.GetRecomendedPositionByBounds(
				balloonBounds,
				document.body.getBoundingClientRect()
			);

			// Check if there are a any recomended position
			if (recomendedPosition !== undefined) {
				let newClassPosition = '';

				switch (recomendedPosition) {
					case OSUIFramework.GlobalEnum.Position.Top:
						newClassPosition = Enum.CssClass.BalloonPositionTop;
						break;
					case OSUIFramework.GlobalEnum.Position.Bottom:
						newClassPosition = Enum.CssClass.BalloonPositionBottom;
						break;
				}

				// Store the current position
				this._balloonPositionClass = newClassPosition;
				// Set the new position
				OSUIFramework.Helper.Dom.Styles.AddClass(this._balloonWrapperElement, newClassPosition);
			}
		}

		// Move ballon element to outside of the pattern context
		private _moveBallonElement(): void {
			const layoutElement = OSUIFramework.Helper.Dom.TagSelector(
				document.body,
				OSUIFramework.Constants.Dot + OSUIFramework.Constants.LayoutClass
			) as HTMLElement;

			OSUIFramework.Helper.Dom.Move(this._balloonWrapperElement, layoutElement);
		}

		// Close when click outside of pattern
		private _onBodyClick(eventType: string, event: MouseEvent): void {
			// Get the target element
			const targetElement = event.target as HTMLElement;
			// Get the closest based on pattern base selector
			const getBaseElement = targetElement.closest(OSUIFramework.Constants.Dot + Enum.CssClass.Pattern);
			// If the click occurs outside of this instance and if it's open, close it!
			if (this._isOpened && getBaseElement !== this._selfElem) {
				this._closeDynamically = true;
				this._close();
			}
		}

		// Update the balloon coordinates
		private _onBodyScroll(): void {
			// If the balloon is open and not IsPhone
			if (this._isOpened && OSUIFramework.Helper.DeviceInfo.IsPhone === false) {
				// Update the coordinates
				this._setBalloonCoordinates();
				// Clean the position if has been defined
				this._cleanPosition();
				// Update/Get the recomended position
				this._getRecomendedPosition();
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
					if (event.key === OSUIFramework.GlobalEnum.Keycodes.Escape) {
						this._close();
					}
					break;
			}
		}

		// Used to set a stopPropagation when click at search input
		private _onSearchInputClicked(event: MouseEvent): void {
			event.stopPropagation();
		}

		// Used to apply the logic when user click to open the Dropdown
		private _onSelectValuesWrapperClicked(): void {
			// Ensure that dropdown can open or close
			if (this._isBlocked === false) {
				this._isOpened ? this._close() : this._open();
			}
		}

		// Manage the behaviour to leave balloon using tabNavigation
		private _onSpanElementFocus(): void {
			// Close the Balloon
			this._close();
		}

		// Manage the behaviour when there are a window resise!
		private _onWindowResize(): void {
			// If there are a resize and the Dropdown is open, close it!
			if (this._isOpened) {
				this._close();
			}
			// Update the Balloon coordinates!
			this._setBalloonCoordinates();
		}

		// Open the Balloon
		private _open(): void {
			this._closeDynamically = false;
			this._isOpened = true;

			this._updatePatternState();
			this._setBalloonCoordinates();
			this._getRecomendedPosition();
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
				if (optionItem.keyboardTriggeredKey === undefined) {
					return;
				}

				// Check which Keyboard key has been pressed
				switch (optionItem.keyboardTriggeredKey) {
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

		// Set balloon position and coordinates based on pattern SelfElement
		private _setBalloonCoordinates(): void {
			// Get all info from the pattern self element
			const selfElement = this._selfElem.getBoundingClientRect();

			// Set Css inline variables
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Top,
				selfElement.top + OSUIFramework.GlobalEnum.Units.Pixel
			);
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Left,
				selfElement.left + OSUIFramework.GlobalEnum.Units.Pixel
			);
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Width,
				selfElement.width + OSUIFramework.GlobalEnum.Units.Pixel
			);
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.InputHeight,
				selfElement.height + OSUIFramework.GlobalEnum.Units.Pixel
			);
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.BalloonMaxHeight,
				this.configs.balloonMaxHeight + OSUIFramework.GlobalEnum.Units.Pixel
			);
		}

		// Method used to add CSS classes to pattern elements
		private _setCssClasses(): void {
			// If search input exist add a class to the balloon
			if (this._balloonSearchInputElement === undefined) {
				// Needed to style the balloon height once at phone
				OSUIFramework.Helper.Dom.Styles.AddClass(
					this._balloonWrapperElement,
					Enum.CssClass.BalloonHasNotSearchInput
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
				// Store DropDownOption Child Item
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
				this._eventOnkeyboardPress
			);
			// Add KeyDown Event to the BalloonContent (OptionsWrapper) (A11y - stuff)
			this._balloonOptionsWrapperElement.addEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyboardPress
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
			// If search input exist (A11y - stuff)
			if (this._balloonSearchInputElement) {
				this._balloonSearchInputElement.addEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.Click,
					this._eventOnClickInputSearch
				);
				// Add keyPress event in order to capture Escape key
				this._balloonSearchInputElement.addEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyboardPress
				);
			}
			// Add the BodyClick callback that will be used Close open Dropdown!
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.BodyOnClick,
				this._eventOnBodyClick
			);
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
			// Add the window resize callback that will be used update the balloon position!
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.WindowResize,
				this._eventOnWindowResize
			);
		}

		// Mehod used to trigger the _platformEventOnToggleCallback callback!
		private _triggerToogleCalbackEvent(): void {
			OSUIFramework.Helper.AsyncInvocation(this._platformEventOnToggleCallback, this.widgetId, this._isOpened);
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this._selectValuesWrapper.removeEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._selectValuesWrapper.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyboardPress
			);
			this._balloonOptionsWrapperElement.removeEventListener(
				OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
				this._eventOnkeyboardPress
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
					OSUIFramework.GlobalEnum.HTMLEvent.Click,
					this._eventOnClickInputSearch
				);
				this._balloonSearchInputElement.removeEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.keyDown,
					this._eventOnkeyboardPress
				);
			}
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.BodyOnClick,
				this._eventOnBodyClick
			);
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.WindowResize,
				this._eventOnWindowResize
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

		// Method that will be used to set/unset the TabIndex to the DropdownBallon elements according it's opened/closed
		private _updateBallonElementsTabIndex(): void {
			const tabIndexValue = this._isOpened
				? OSUIFramework.Constants.A11YAttributes.States.TabIndexShow
				: OSUIFramework.Constants.A11YAttributes.States.TabIndexHidden;

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
			this._updateBallonElementsTabIndex();

			// If balloon will open
			if (this._isOpened) {
				// Add IsOpend Class!
				OSUIFramework.Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpened);
				OSUIFramework.Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Enum.CssClass.IsOpened);

				// Check if inputSearch exist
				if (this._balloonSearchInputElement) {
					this._balloonSearchInputElement.focus();
				} else {
					this._balloonOptionsWrapperElement.focus();
				}

				// Trigger the toggle callback event
				this._triggerToogleCalbackEvent();
			} else {
				// Remove IsOpend Class => Close it!
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpened);
				OSUIFramework.Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, Enum.CssClass.IsOpened);

				// Block the pattern in order to avoid user click to open it again before animation ends!
				this._isBlocked = true;

				// Add the TransitionEnd event
				this._balloonWrapperElement.addEventListener(
					OSUIFramework.GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnCloseTransitionEnd
				);
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
			this._eventOnBodyClick = this._onBodyClick.bind(this);
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
			this._eventOnClick = this._onSelectValuesWrapperClicked.bind(this);
			this._eventOnClickInputSearch = this._onSearchInputClicked.bind(this);
			this._eventOnCloseTransitionEnd = this._endOfCloseAnimation.bind(this);
			this._eventOnkeyboardPress = this._onKeyboardPressed.bind(this);
			this._eventOnSpanFocus = this._onSpanElementFocus.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			this._balloonFooterElement = OSUIFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.BalloonFooter
			);
			this._balloonFocusableElemsInFooter = OSUIFramework.Helper.Dom.TagSelectorAll(
				this._balloonFooterElement,
				OSUIFramework.Constants.FocusableElems
			);
			this._balloonSearchInputWrapperElement = OSUIFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.BalloonSearch
			);
			this._balloonSearchInputElement = OSUIFramework.Helper.Dom.TagSelector(
				this._balloonSearchInputWrapperElement,
				OSUIFramework.GlobalEnum.HTMLElement.Input
			);
			this._balloonContainerElement = OSUIFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.BalloonContainer
			);
			this._balloonWrapperElement = OSUIFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.BalloonWrapper
			);
			this._balloonOptionsWrapperElement = OSUIFramework.Helper.Dom.ClassSelector(
				this._balloonWrapperElement,
				Enum.CssClass.BalloonContent
			);
			this._selectValuesWrapper = OSUIFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.SelectValuesWrapper
			);

			// Add custom SPAN HTML Elements that will help on Accessibility keyboard navigation
			this._addSpanHtmlElements();
			// Add Accessibility properties
			this.setA11yProperties();
			// Add the pattern Events
			this._setUpEvents();
			// Add CSS classes
			this._setCssClasses();
			// Ensure that the Move only happens after HTML elements has been set!
			this._moveBallonElement();
			// Set the balloon coordinates
			this._setBalloonCoordinates();

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
			this._eventOnBodyClick = undefined;
			this._eventOnBodyScroll = undefined;
			this._eventOnClick = undefined;
			this._eventOnClickInputSearch = undefined;
			this._eventOnCloseTransitionEnd = undefined;
			this._eventOnkeyboardPress = undefined;
			this._eventOnSpanFocus = undefined;
			this._eventOnWindowResize = undefined;
			this._platformEventInitializedCallback = undefined;
			this._platformEventOnToggleCallback = undefined;
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
			this._balloonContainerElement = undefined;
			this._balloonFocusableElemsInFooter = [];
			this._balloonFooterElement = undefined;
			this._balloonOptionsWrapperElement = undefined;
			this._balloonSearchInputElement = undefined;
			this._balloonSearchInputWrapperElement = undefined;
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
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSUIDropdownServerSide
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
		 * @memberof OSUIDropdownServerSide
		 */
		public clear(): void {
			// Get all Selected Items
			const selectedOptions = this.childItems.filter((item) => item.IsSelected);
			// Go through all the seected option items
			for (const optionItem of selectedOptions) {
				// Unselect it!
				optionItem.toggleSelected(false);
			}
		}

		/**
		 * Set pattern with a disable status
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		public disable(): void {
			// Assign disabled status.
			OSUIFramework.Helper.Dom.Attribute.Set(
				this.selfElement,
				OSUIFramework.GlobalEnum.HTMLAttributes.Disabled,
				''
			);
			OSUIFramework.Helper.Dom.Attribute.Set(
				this._balloonWrapperElement,
				OSUIFramework.GlobalEnum.HTMLAttributes.Disabled,
				''
			);
			// Assign IsDisabled class
			OSUIFramework.Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsDisabled);
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
			// Remove disabled status.
			OSUIFramework.Helper.Dom.Attribute.Remove(
				this.selfElement,
				OSUIFramework.GlobalEnum.HTMLAttributes.Disabled
			);
			OSUIFramework.Helper.Dom.Attribute.Remove(
				this._balloonWrapperElement,
				OSUIFramework.GlobalEnum.HTMLAttributes.Disabled
			);
			// Remove IsDisabled class
			OSUIFramework.Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsDisabled);
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

				case Enum.Events.OnToggle:
					if (this._platformEventOnToggleCallback === undefined) {
						this._platformEventOnToggleCallback = callback;
					}
					break;

				default:
					throw new Error(
						`${OSUIFramework.ErrorCodes.Dropdown.FailRegisterCallback}:	The given '${eventName}' event name is not defined.`
					);
			}
		}

		/**
		 * Set the validation status, and also pass the message to show
		 *
		 * @param {boolean} Set if the dropdown is valid or not
		 * @param {string} Text message to be added
		 * @memberof OSUIDropdownServerSide
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
	}
}
