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
		// Store the HTML element for the ActiveScreen where a status class will be updated accoding balloon is open or not.
		private _activeScreenElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonContainer
		private _balloonContainerElement: HTMLElement;
		// Store the HTML element for the DropdownBalloonContent
		private _balloonContentElement: HTMLElement;
		// Store all the focusable elements inside footer if it's the case!
		private _balloonFocusableElemsInFooter: HTMLElement[];
		// Store the HTML element for the DropdownBalloonFooter
		private _balloonFooterElement: HTMLElement;
		// Store the BalloonOptions container AriaLabel text
		private _balloonOptionsAriaLabel: string;
		// Store the HTML element for the Dropdown otpions
		private _balloonOptionsWrapperElement: HTMLElement;
		// Store the balloon position when/if a recommended position has been added!
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
		private _eventOnBodyClick: GlobalCallbacks.Generic;
		// Click Event
		private _eventOnClick: GlobalCallbacks.Generic;
		private _eventOnClickInputSearch: GlobalCallbacks.Generic;
		// Event OnTransitionEnd applied to the Balloon
		private _eventOnCloseTransitionEnd: GlobalCallbacks.Generic;
		// Event OnOrientationChange Event
		private _eventOnOrientationChange: GlobalCallbacks.Generic;
		// Event OnScreenScroll
		private _eventOnScreenScroll: GlobalCallbacks.Generic;
		// OnSearchInputBlur Event
		private _eventOnSearchInputBlur: GlobalCallbacks.Generic;
		// OnSearchInputFocus Event
		private _eventOnSearchInputFocus: GlobalCallbacks.Generic;
		// OnFocus Event at ballon custom span elements
		private _eventOnSpanFocus: GlobalCallbacks.Generic;
		// OnTouchMove Event at the balloon wrapper
		private _eventOnTouchMove: GlobalCallbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: GlobalCallbacks.Generic;
		// Keyboard Key Press Event
		private _eventOnkeyboardPress: GlobalCallbacks.Generic;
		// Store the instance of the Object responsible to Add Custom HTML elements to the DropdownBallon that will help on deal with keyboard navigation (Accessibility)
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Flag that will be used to check if DropdownBalloon should be also set with a11y selector.
		private _hasA11yEnabled = false;
		// Set the observer that will check if the balloon is inside screen boundaries!
		private _intersectionObserver: IntersectionObserver;
		// Store a Flag property that will control if the dropdown is blocked (like it's under closing animation)
		private _isBlocked = false;
		// Store the Element State, by default is closed!
		private _isOpen = false;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: GlobalCallbacks.OSGeneric;
		// Store the HTML element for the Dropdown Select Wrapper
		private _selectValuesWrapper: HTMLElement;
		// Store the SelectValuesWrapper AriaLabel text
		private _selectValuesWrapperAriaLabel: string;
		// Store the selfElementBounds in order to check if they changed!
		private _selfElementBoundingClientRect: DOMRect = new DOMRect(0, 0);
		// Store the window width value in order to check if has changed at windowResize
		private _windowWidth: number;

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

		// Close the Balloon
		private _close(): void {
			if (this._isOpen === false) {
				return;
			}

			// Check if the close will be done by logic instead of user interaction
			if (this._closeDynamically === false) {
				// Set focus to the base element
				this._selectValuesWrapper.focus();
			}

			// Remove isVisible class from the body
			Helper.Dom.Styles.RemoveClass(document.body, Enum.CssClass.IsVisible);

			// Update the touchMove when pattern is open!
			this._touchMove();

			// Update status property
			this._isOpen = false;
			// Update pattern status!
			this._updatePatternState();
			// Cancel the Observer!
			this._unsetObserver();
			// Remove event listeners
			this._unsetEvents(true);
		}

		// Update stuff at end of close animation
		private _endOfCloseAnimation(): void {
			// Remove the TransitionEnd event
			this._balloonWrapperElement.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnCloseTransitionEnd
			);

			// Since animation already ended let's unblock the pattern to be possible open it again
			this._isBlocked = false;

			// Reset to the default position...
			if (this._balloonPositionClass !== '') {
				Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, this._balloonPositionClass);
				this._balloonPositionClass = Enum.CssClass.BalloonPositionBottom;
				Helper.Dom.Styles.AddClass(this._balloonWrapperElement, this._balloonPositionClass);
			}

			// Trigger the toggle callback event
			this._triggerToogleCalbackEvent();
		}

		// Set the recommended position to open the balloon
		private _getRecommendedPosition(isIntersecting: boolean, boundingClientRect: DOMRect): void {
			// Ensure it's inside screen and it's open
			if (isIntersecting || this._isOpen === false) {
				return;
			}

			// Get the recommended position to open the balloon
			const recommendedPosition = Helper.BoundPosition.GetRecommendedPositionByBounds(
				boundingClientRect,
				Helper.BoundPosition.GetBodyBounds()
			);

			let newClassPosition = '';

			switch (recommendedPosition) {
				case GlobalEnum.Position.Top:
					newClassPosition = Enum.CssClass.BalloonPositionTop;
					break;
				case GlobalEnum.Position.Bottom:
					newClassPosition = Enum.CssClass.BalloonPositionBottom;
					break;
			}

			if (recommendedPosition !== undefined && newClassPosition !== this._balloonPositionClass) {
				// Remove the older vertical position!
				Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, this._balloonPositionClass);

				this._balloonPositionClass = newClassPosition;

				// Set the new position
				Helper.Dom.Styles.AddClass(this._balloonWrapperElement, this._balloonPositionClass);
			}
		}

		// Method to set the FocusTrap at DropdownBallon in order to help on deal with keyboard navigation (Accessibility)
		private _handleFocusTrap(): void {
			const opts = {
				focusBottomCallback: this._eventOnSpanFocus.bind(this),
				focusTargetElement: this._balloonWrapperElement,
				focusTopCallback: this._eventOnSpanFocus.bind(this),
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		// Method that will return HasNoImplementation Error Info
		private _hasNoImplementation(): string {
			throw new Error(
				`${ErrorCodes.Dropdown.HasNoImplementation.code}: ${ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}

		// Move ballon element to active screen element, outside of the pattern context
		private _moveBallonElement(): void {
			Helper.Dom.Move(this._balloonWrapperElement, this._activeScreenElement);
		}

		// Close when click outside of pattern
		private _onBodyClick(_eventType: string, event: MouseEvent): void {
			if (this._isOpen === false) {
				return;
			}
			// Get the target element
			const targetElement = event.target as HTMLElement;
			// Get the closest based on pattern base selector
			const getBaseElement =
				targetElement.closest(Constants.Dot + Enum.CssClass.Pattern) ||
				targetElement.closest(Constants.Dot + Enum.CssClass.BalloonWrapper);

			// If it's phone, always close, as it is on popup mode
			if (
				Helper.DeviceInfo.IsPhone ||
				(Helper.DeviceInfo.IsPhone === false &&
					getBaseElement !== this.selfElement &&
					getBaseElement !== this._balloonWrapperElement)
			) {
				this._closeDynamically = true;
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
					if (event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space) {
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
						} else {
							this._focusTrapInstance.topElement.focus();
						}
					} else if (event.key === GlobalEnum.Keycodes.ArrowDown) {
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
					if (event.key === GlobalEnum.Keycodes.Escape) {
						this._close();
					}
					break;
			}
		}

		// Close the balloon if it's open!
		private _onOrientationChange(): void {
			if (this._isOpen) {
				this._close();
			}
		}

		// Update the balloon coordinates
		private _onScreenScroll(): void {
			if (this.isBuilt && this._isOpen) {
				// If it's tablet close it in order to prevent flickering on updating it's position!
				if (Helper.DeviceInfo.IsTablet) {
					this._close();
					return;
				}

				// If the balloon is open and Desktop
				// Update the coordinates
				requestAnimationFrame(this._setBalloonCoordinates.bind(this));
			}
		}

		// Also Used to manage the balloon height accordingly keyboard is in use due to the way iOS deal with it!
		private _onSearchInputBlur(): void {
			Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, Enum.CssClass.SearchInputIsFocused);
		}

		// Used to set a stopPropagation when click at search input
		private _onSearchInputClicked(event: MouseEvent): void {
			event.stopPropagation();
		}

		// Used to manage the balloon height accordingly keyboard is in use due to the way iOS deal with it!
		private _onSearchInputFocus(): void {
			Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Enum.CssClass.SearchInputIsFocused);
		}

		// Used to apply the logic when user click to open the Dropdown
		private _onSelectValuesWrapperClicked(): void {
			// Ensure that dropdown can open or close
			if (this._isBlocked === false) {
				this._isOpen ? this._close() : this._open();
			}
		}

		// Manage the behaviour to leave balloon using tabNavigation
		private _onSpanElementFocus(): void {
			// Close the Balloon
			this._close();
		}

		// Manage the OnTouchMove action
		private _onTouchMove(event: TouchEvent): void {
			if (event.target === this._balloonWrapperElement) {
				event.preventDefault();
			}
		}

		// Manage the behaviour when there is a window resize!
		private _onWindowResize(): void {
			// If there is a horizontal resize and the Dropdown is open, close it!
			if (this._isOpen && this._windowWidth !== window.innerWidth) {
				this._close();
			}
			// Update windowWidth value
			this._windowWidth = window.innerWidth;
			// Update the Balloon coordinates!
			this._setBalloonCoordinates();
		}

		// Open the Balloon
		private _open(): void {
			if (this._isOpen) {
				return;
			}

			this._closeDynamically = false;
			this._isOpen = true;

			// Set the windown width value
			this._windowWidth = window.innerWidth;

			this._setBalloonCoordinates();

			// Update the touchMove when pattern is open!
			this._touchMove();

			// Add the isVisible class to body
			Helper.Dom.Styles.AddClass(document.body, Enum.CssClass.IsVisible);
			this._updatePatternState();

			// Set the Observer in order to update it's position if balloon is out of bounds!
			this._setObserver();

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
						} else {
							this._focusTrapInstance.topElement.focus();
						}
						break;

					// Tab
					case GlobalEnum.Keycodes.Tab:
						// Check if there are focusable elements inside footer
						if (this._balloonFocusableElemsInFooter.length > 0) {
							// Set focus the the first one
							this._balloonFocusableElemsInFooter[0].focus();
						} else {
							this._focusTrapInstance.bottomElement.focus();
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

		// Set balloon position and coordinates based on pattern SelfElement
		private _setBalloonCoordinates(lookAtXPosition = true): void {
			// Get all info from the pattern self element
			const selfElement = this.selfElement.getBoundingClientRect();

			// Check if the position didn't change!
			if (
				(lookAtXPosition === false && selfElement.y === this._selfElementBoundingClientRect.y) ||
				(lookAtXPosition &&
					selfElement.x === this._selfElementBoundingClientRect.x &&
					selfElement.right ===
						this._selfElementBoundingClientRect.x + this._selfElementBoundingClientRect.width &&
					selfElement.y === this._selfElementBoundingClientRect.y)
			)

			// Store the new selElement coordinates
			this._selfElementBoundingClientRect.x = selfElement.x;
			this._selfElementBoundingClientRect.y = selfElement.y;

			// Set Css inline variables
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Top,
				selfElement.top + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Left,
				selfElement.left + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.Width,
				selfElement.width + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.InputHeight,
				selfElement.height + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.BalloonMaxHeight,
				this.configs.balloonMaxHeight + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._balloonWrapperElement,
				Enum.InlineCssVariables.ThresholVerticalAnimate,
				Enum.PropertiesValues.ThresholVerticalAnimateValue + GlobalEnum.Units.Pixel
			);
		}

		// Method used to set the ExtendedClass to the balloon wrapper as well
		private _setBalloonWrapperExtendedClass(newExtendedClass: string, preExtendedClass = '') {
			// Since balloon wrapper will not be at the pattern context, let's also set/update the extendedClass to it!
			Helper.Dom.Styles.ExtendedClass(this._balloonContainerElement, preExtendedClass, newExtendedClass);
		}

		// Method used to add CSS classes to pattern elements
		private _setCssClasses(): void {
			// If search input exist add a class to the balloon
			if (this._balloonSearchInputElement === undefined) {
				// Needed to style the balloon height once at phone
				Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Enum.CssClass.BalloonHasNotSearchInput);
			}

			// Check if the ExtendedClass attribute must be set since balloon will be moved outise of pattern context
			if (this.configs.ExtendedClass !== '') {
				this._setBalloonWrapperExtendedClass(this.configs.ExtendedClass);
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

		// Set the Observer
		private _setObserver() {
			// Check if browser has the IntersectionObserver capability!
			if (window.IntersectionObserver) {
				this._intersectionObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							this._getRecommendedPosition(entry.isIntersecting, entry.boundingClientRect);
						});
					},
					{ threshold: 1 }
				);

				// Start observing it!
				this._intersectionObserver.observe(this._balloonWrapperElement);
			} else {
				console.warn(
					`${ErrorCodes.DropdownServerSide.FailOnSetIntersectionObserver}: The browser in use does not support IntersectionObserver. Dropdown balloon position won't be properly updated.`
				);
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
				
				if(Helper.DeviceInfo.IsPhone === false) {
					// Add the ScreenScroll callback that will be used to update the balloon coodinates
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
						Event.DOMEvents.Listeners.Type.ScreenOnScroll,
						this._eventOnScreenScroll
					);
				}

				// Add the window resize callback that will be used to update the balloon position!
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.WindowResize,
					this._eventOnWindowResize
				);

				// Add the OnOrientationChange callback that will be used to close the balloon position!
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.OrientationChange,
					this._eventOnOrientationChange
				);
			}
		}

		// Method used to manage the onTouchMove when we're at mobile devices in order to block the window scroll!
		// This is an improvement specially to iOS since otherwise it will be able to scroll the pattern when keyboard is open!
		private _touchMove(): void {
			// Check if the used browser has TouchMove event and if it's an iOS device
			if (Helper.DeviceInfo.IsIos && 'ontouchmove' in window) {
				if (this._isOpen) {
					this._balloonWrapperElement.addEventListener(
						GlobalEnum.HTMLEvent.TouchMove,
						this._eventOnTouchMove
					);
				} else {
					this._balloonWrapperElement.removeEventListener(
						GlobalEnum.HTMLEvent.TouchMove,
						this._eventOnTouchMove
					);
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
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventOnBodyClick
			);

			if(Helper.DeviceInfo.IsPhone === false) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
					Event.DOMEvents.Listeners.Type.ScreenOnScroll,
					this._eventOnScreenScroll
				);
			}

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnWindowResize
			);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.OrientationChange,
				this._eventOnOrientationChange
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
					`${ErrorCodes.Dropdown.FailUnsetNewOptionItem}: The ${GlobalEnum.PatternName.DropdownServerSideItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternName.Dropdown} with Id: ${this.widgetId}.`
				);
			}
		}

		// Stop Observer
		private _unsetObserver(): void {
			if (this._intersectionObserver !== undefined) {
				this._intersectionObserver.disconnect();
				this._intersectionObserver = undefined;
			}
		}

		// Method that will be used to set/unset the TabIndex to the DropdownBallon elements according it's opened/closed
		private _updateBalloonAccessibilityElements(): void {
			const tabIndexValue = this._isOpen
				? Constants.A11YAttributes.States.TabIndexShow
				: Constants.A11YAttributes.States.TabIndexHidden;

			// Get the layout container
			const layoutElemContainer = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.Layout
			);
			// If it exist and contains a11y class, we must enable it to the Balloon as well since it will be placed outside layout container.
			this._hasA11yEnabled =
				layoutElemContainer !== undefined &&
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					layoutElemContainer,
					OSFramework.OSUI.Constants.HasAccessibilityClass
				);

			// If there is the Search input
			if (this._balloonSearchInputElement !== undefined) {
				Helper.A11Y.TabIndex(this._balloonSearchInputElement, tabIndexValue);
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
				this._focusTrapInstance.enableForA11y();
				// If a11y is enabled at the layout, set it to the ballon as well since if it't outside of layout context
				if (this._hasA11yEnabled) {
					Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Constants.HasAccessibilityClass);
				}
				// Ballon Options Wrapper
				Helper.A11Y.AriaHiddenFalse(this._balloonOptionsWrapperElement);
			} else {
				this._focusTrapInstance.disableForA11y();
				// Remove a11y selector in order to grant it will be updated each time Balloon gets open
				Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, Constants.HasAccessibilityClass);
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
				// Add IsOpend Class!
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.AddClass(this._balloonWrapperElement, Enum.CssClass.IsOpened);

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
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.RemoveClass(this._balloonWrapperElement, Enum.CssClass.IsOpened);

				// Block the pattern in order to avoid user click to open it again before animation ends!
				this._isBlocked = true;

				// Add the TransitionEnd event
				this._balloonWrapperElement.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnCloseTransitionEnd
				);
			}
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
			Helper.A11Y.AriaHasPopup(this._selectValuesWrapper, Constants.A11YAttributes.Role.Listbox);
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
			this._eventOnScreenScroll = this._onScreenScroll.bind(this);
			this._eventOnClick = this._onSelectValuesWrapperClicked.bind(this);
			this._eventOnClickInputSearch = this._onSearchInputClicked.bind(this);
			this._eventOnCloseTransitionEnd = this._endOfCloseAnimation.bind(this);
			this._eventOnkeyboardPress = this._onKeyboardPressed.bind(this);
			this._eventOnOrientationChange = this._onOrientationChange.bind(this);
			this._eventOnSearchInputBlur = this._onSearchInputBlur.bind(this);
			this._eventOnSearchInputFocus = this._onSearchInputFocus.bind(this);
			this._eventOnSpanFocus = this._onSpanElementFocus.bind(this);
			this._eventOnTouchMove = this._onTouchMove.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected setHtmlElements(): void {
			this._activeScreenElement = Helper.Dom.ClassSelector(
				document.body,
				GlobalEnum.CssClassElements.ActiveScreen
			);
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
			this._balloonContentElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonContent);
			this._balloonWrapperElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonWrapper);
			this._balloonOptionsWrapperElement = Helper.Dom.ClassSelector(
				this._balloonWrapperElement,
				Enum.CssClass.BalloonContent
			);
			this._selectValuesWrapper = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.SelectValuesWrapper);

			// Set focusTrap in order to help with A11y
			this._handleFocusTrap();
			// Add Accessibility properties
			this.setA11YProperties();
			// Add the pattern Events
			this._setUpEvents();
			// Add CSS classes
			this._setCssClasses();
			// Ensure that the Move only happens after HTML elements has been set!
			this._moveBallonElement();
			// Set the balloon coordinates
			this._setBalloonCoordinates();
		}

		/**
		 * Unset callbacks that has been assigned to the element
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected unsetCallbacks(): void {
			this._eventOnBodyClick = undefined;
			this._eventOnScreenScroll = undefined;
			this._eventOnClick = undefined;
			this._eventOnClickInputSearch = undefined;
			this._eventOnCloseTransitionEnd = undefined;
			this._eventOnkeyboardPress = undefined;
			this._eventOnOrientationChange = undefined;
			this._eventOnSearchInputBlur = undefined;
			this._eventOnSearchInputFocus = undefined;
			this._eventOnSpanFocus = undefined;
			this._eventOnTouchMove = undefined;
			this._eventOnWindowResize = undefined;
			this._platformEventOnToggleCallback = undefined;
		}

		/**
		 * Method to unset the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Dropdown.ServerSide.OSUIDropdownServerSide
		 */
		protected unsetHtmlElements(): void {
			// Ensure that the ballon has been removed from the DOM since it has been Moved to outside of pattern context.
			this._balloonWrapperElement.remove();

			// unset the local properties
			this._activeScreenElement = undefined;
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
			this._setInitialOptions();
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
			// Store previous extended class before change it!
			const prevBalloonExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsDisabled:
						propertyValue ? this.disable() : this.enable();
						break;

					case GlobalEnum.CommonPatternsProperties.ExtendedClass:
						this._setBalloonWrapperExtendedClass(propertyValue as string, prevBalloonExtendedClass);
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
			Helper.Dom.Attribute.Set(this._balloonWrapperElement, GlobalEnum.HTMLAttributes.Disabled, '');
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
			this._unsetObserver();
			this._focusTrapInstance.dispose();
			this._unsetEvents();
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
			Helper.Dom.Attribute.Remove(this._balloonWrapperElement, GlobalEnum.HTMLAttributes.Disabled);
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
				// Due to the error message text, update the balloon position
				this._setBalloonCoordinates();
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
