// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tooltip {
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Store the HTML element for the ActiveScreen where a status class will be updated accoding balloon is open or not.
		private _activeScreenElement: HTMLElement;
		// Event OnMouseEnter at _tooltipBalloonWrapperElem
		private _eventBalloonWrapperOnMouseEnter: GlobalCallbacks.Generic;
		// Event OnMouseLeave at at _tooltipBalloonWrapperElem
		private _eventBalloonWrapperOnMouseLeave: GlobalCallbacks.Generic;
		// Event OnMouseEnter at _tooltipIconElem
		private _eventIconOnMouseEnter: GlobalCallbacks.Generic;
		// Event OnMouseLeave at at _tooltipIconElem
		private _eventIconOnMouseLeave: GlobalCallbacks.Generic;
		// Event OnBalloonClick - Manage the balloon click!
		private _eventOnBalloonClick: GlobalCallbacks.Generic;
		// Event OnPatternBlur (combined with focus)
		private _eventOnBlur: GlobalCallbacks.Generic;
		// Event OnBodyClick
		private _eventOnBodyClick: GlobalCallbacks.Generic;
		// Event OnBodyScroll
		private _eventOnBodyScroll: GlobalCallbacks.Generic;
		// Event OnPatternClick
		private _eventOnClick: GlobalCallbacks.Generic;
		// Event OnPatternFocus
		private _eventOnFocus: GlobalCallbacks.Generic;
		// Event OnPatternKeypress
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// Event OnOpendBalloon
		private _eventOnOpenedBalloon: GlobalCallbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: GlobalCallbacks.Generic;
		// Store focus manager instance
		private _focusManagerInstance: Behaviors.FocusManager;
		// Set the observer that will check if the balloon is inside screen boundaries!
		private _intersectionObserver: IntersectionObserver;
		// Flag used to manage if it's _tooltipBalloonWrapperElem  has been MouseEnter
		private _isBalloonWrapperMouseEnter = false;
		// Flag used to manage if it's _tooltipIconElem  has been MouseEnter
		private _isIconMouseEnter = false;
		// Flag used to manage if it's open or closed!
		private _isOpen: boolean;
		// Flag used to deal with onBodyClick and open api concurrency methods!
		private _isOpenedByApi = false;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: GlobalCallbacks.OSGeneric;
		// Store the RequestAnimationFrame that will be triggered at OnBodyScroll
		private _requestAnimationOnBodyScroll: number;
		// Store the RequestAnimationFrame that will be triggered at OnWindowResize
		private _requestAnimationOnWindowResize: number;
		// Store the selfElementBounds in order to check if they changed!
		private _selfElementBoundingClientRect: DOMRect = new DOMRect(0, 0);
		// Store the HTML elements
		private _tooltipBalloonContentActiveElem: HTMLElement;
		private _tooltipBalloonContentElem: HTMLElement;
		private _tooltipBalloonPositionClass = '';
		private _tooltipBalloonWrapperElem: HTMLElement;
		private _tooltipIconElem: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TooltipConfig(configs));

			this._isOpen = this.configs.StartVisible;
			this._tooltipBalloonPositionClass = this.configs.Position;
		}

		// Move balloon element to active screen, outside of the pattern context
		private _moveBalloonElement(): void {
			Helper.Dom.Move(this._tooltipBalloonWrapperElem, this._activeScreenElement);
		}

		// Check if a clickable item has been clicked, otherwise stop the propagation!
		private _onBalloonClick(e: MouseEvent): void {
			// Get all possible clickable items inside tooltip balloon
			const clickableItems = Array.from(
				this._tooltipBalloonContentElem.querySelectorAll(
					Constants.FocusableElems + ', ' + GlobalEnum.HTMLAttributes.AllowEventPropagation
				)
			);

			// If there no clickable items, do not let the click be propagated!
			if (clickableItems.length === 0) {
				e.stopPropagation();
				return;
			}

			// Flag used to help on go through all the clickable items to ensure we check all!
			let isItemClickableItem = false;

			// Check each clickable item
			for (const item of clickableItems) {
				// If the clicked item exist as a clickableItem!
				if (e.target === item) {
					isItemClickableItem = true;
					break;
				}
			}

			// If we found the clicked item does not exist as a clickableItem, do no let the click be propagated!
			if (isItemClickableItem === false) {
				e.stopPropagation();
			}
		}

		// OnMouseEnter at _tooltipBalloonWrapperElem
		private _onBalloonWrapperMouseEnter(): void {
			this._isBalloonWrapperMouseEnter = true;
		}

		// OnMouseLeave at _tooltipBalloonWrapperElem
		private _onBalloonWrapperMouseLeave(): void {
			this._isBalloonWrapperMouseEnter = false;

			Helper.AsyncInvocation(() => {
				if (this._isIconMouseEnter === false) {
					this._triggerClose();
				}
			});
		}

		// Method to close the tooltip at onBlur
		private _onBlur(): void {
			// Wait for next activeElement be active
			Helper.AsyncInvocation(() => {
				// Check if a previous active element has been assigned
				if (this._tooltipBalloonContentActiveElem) {
					this._tooltipBalloonContentActiveElem.removeEventListener(
						GlobalEnum.HTMLEvent.Blur,
						this._eventOnBlur
					);
				}

				// Get the closest element in order to check if the activeElement is inside this TooltipBalloon
				const _closestElem = document.activeElement.closest(Constants.Dot + Enum.CssClass.Pattern);
				if (_closestElem !== this.selfElement) {
					// Close Tooltip
					this._triggerClose();
				} else {
					// Add the blur event in order to proper close the tooltip after its blur
					this._tooltipBalloonContentActiveElem = document.activeElement as HTMLElement;
					this._tooltipBalloonContentActiveElem.addEventListener(
						GlobalEnum.HTMLEvent.Blur,
						this._eventOnBlur
					);
				}
			});
		}

		// Close tooltip if user has clicked outside of it
		private _onBodyClick(_eventName: string, e: MouseEvent): void {
			if (this.isBuilt && this._isOpenedByApi === false) {
				const _clickedElem = e.target as HTMLElement;
				const _closestElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);
				const _closestBalloonElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.BalloonWrapper);

				// If the click has occur outside of this tooltip, or tooltipBalloon!
				if (_closestElem !== this.selfElement && _closestBalloonElem !== this._tooltipBalloonWrapperElem) {
					// Remove the Event
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
						Event.DOMEvents.Listeners.Type.BodyOnClick,
						this._eventOnBodyClick
					);

					// Close Tooltip
					this._triggerClose();
				}
			}
		}

		// Update the balloon coordinates
		private _onBodyScroll(): void {
			if (this.isBuilt) {
				// If it's open and not at Desktop, close it!
				if (this._isOpen && Helper.DeviceInfo.IsDesktop === false) {
					cancelAnimationFrame(this._requestAnimationOnBodyScroll);
					this._triggerClose();
					return;
				}

				// If the balloon is open and not IsPhone
				if (this._isOpen) {
					// Update the coordinates
					this._setBalloonCoordinates();
					// Update the "animation" before the next repaint
					this._requestAnimationOnBodyScroll = requestAnimationFrame(this._eventOnBodyScroll);
				} else {
					cancelAnimationFrame(this._requestAnimationOnBodyScroll);
				}
			}
		}

		// Trigger the tooltip at onClick behaviour
		private _onClick(e: MouseEvent): void {
			e.stopPropagation();
			this._triggerOpen();
		}

		// Open the tooltip
		private _onFocus(): void {
			this._triggerOpen();
		}

		// OnMouseEnter at _tooltipIconElem
		private _onIconMouseEnter(): void {
			this._isIconMouseEnter = true;

			if (this._isOpen === false) {
				this._triggerOpen();
			}
		}

		// OnMouseLeave at _tooltipIconElem
		private _onIconMouseLeave(): void {
			this._isIconMouseEnter = false;

			Helper.AsyncInvocation(() => {
				if (this._isBalloonWrapperMouseEnter === false) {
					this._triggerClose();
				}
			});
		}

		// Used to update the tooltip position after it's closed
		private _onOpenedBalloon(): void {
			// Remove the transition event!
			this._tooltipBalloonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnOpenedBalloon
			);

			// Remove the selector that add transitions to the balloon!
			Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpening);
		}

		// Manage the behaviour when there is a window resize!
		private _onWindowResize(): void {
			// Update Coordinates
			this._setBalloonCoordinates();

			// If there is a horizontal resize and the Dropdown is open, close it!
			if (this._isOpen) {
				// Update the "animation" before the next repaint
				this._requestAnimationOnWindowResize = requestAnimationFrame(this._eventOnWindowResize);
			} else {
				cancelAnimationFrame(this._requestAnimationOnWindowResize);
			}
		}

		// Call methods to open or close, based on e.key and behaviour applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			if (this._isOpen) {
				// Close the Balloon when pressing Esc
				if (isEscapedPressed) {
					this.close();
				}
			}
			e.stopPropagation();
		}

		// Set balloon position and coordinates based on pattern SelfElement
		private _setBalloonCoordinates(): void {
			// Get all info from the pattern self element
			const selfElement = this.selfElement.getBoundingClientRect();

			// Check if the position didn't change!
			if (
				selfElement.x === this._selfElementBoundingClientRect.x &&
				selfElement.y === this._selfElementBoundingClientRect.y
			) {
				cancelAnimationFrame(this._requestAnimationOnBodyScroll);
				return;
			}

			// Store the new selElement coordinates
			this._selfElementBoundingClientRect.x = selfElement.x;
			this._selfElementBoundingClientRect.y = selfElement.y;

			// Set Css inline variables
			Helper.Dom.Styles.SetStyleAttribute(
				this._tooltipBalloonWrapperElem,
				Enum.InlineCssVariables.Top,
				selfElement.top + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._tooltipBalloonWrapperElem,
				Enum.InlineCssVariables.Left,
				selfElement.left + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._tooltipBalloonWrapperElem,
				Enum.InlineCssVariables.Width,
				selfElement.width + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._tooltipBalloonWrapperElem,
				Enum.InlineCssVariables.Height,
				selfElement.height + GlobalEnum.Units.Pixel
			);
		}

		// Set the recommended position to open the balloon
		private _setBalloonPosition(isIntersecting: boolean, boundingClientRect: DOMRect): void {
			// Ensure it's open and inside screen!!!
			if (isIntersecting || this._isOpen === false) {
				return;
			}

			// Get the recommended position to open the balloon
			const recommendedPosition = Helper.BoundPosition.GetRecommendedPositionByBounds(
				boundingClientRect,
				document.body.getBoundingClientRect()
			);

			if (recommendedPosition !== undefined && recommendedPosition !== this._tooltipBalloonPositionClass) {
				// Remove the older vertical position!
				Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, this._tooltipBalloonPositionClass);

				// Check if the recomended position is Top/Bottom!
				if (
					(recommendedPosition === GlobalEnum.Position.Top ||
						recommendedPosition === GlobalEnum.Position.Bottom) &&
					this._tooltipBalloonPositionClass !== GlobalEnum.Position.Top &&
					this._tooltipBalloonPositionClass !== GlobalEnum.Position.Bottom
				) {
					// Clean top/bottom positions from Balloon position class if they exist!
					this._tooltipBalloonPositionClass = this._tooltipBalloonPositionClass
						.replace(GlobalEnum.Position.Top + '-', '')
						.replace(GlobalEnum.Position.Bottom + '-', '');

					// Let's also use the previous left/right as well...
					this._tooltipBalloonPositionClass = recommendedPosition + '-' + this._tooltipBalloonPositionClass;
				} else {
					this._tooltipBalloonPositionClass = recommendedPosition;
				}

				// Set the new position
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, this._tooltipBalloonPositionClass);
			}
		}

		// Method used to set the ExtendedClass to the balloon wrapper as well
		private _setBalloonWrapperExtendedClass(newExtendedClass: string, preExtendedClass = '') {
			// Since balloon wrapper will not be at the pattern context, let's also set/update the extendedClass to it!
			Helper.Dom.Styles.ExtendedClass(this._tooltipBalloonWrapperElem, preExtendedClass, newExtendedClass);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setCssClasses(): void {
			// Set default IsHover cssClass property value
			if (this.configs.IsHover) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsHover);
			}

			// Set default IsVisible cssClass property value
			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);
			}

			// Check if the ExtendedClass attribute must be set since balloon will be moved outise of pattern context
			if (this.configs.ExtendedClass !== '') {
				this._setBalloonWrapperExtendedClass(this.configs.ExtendedClass);
			}

			// Set default Position cssClass property value
			Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, this._tooltipBalloonPositionClass);
		}

		// Set the Observer
		private _setObserver() {
			// Check if browser has the IntersectionObserver capability!
			if (window.IntersectionObserver) {
				this._intersectionObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							this._setBalloonPosition(entry.isIntersecting, entry.boundingClientRect);
						});
					},
					{ threshold: 1 }
				);

				// Start observing it!
				this._intersectionObserver.observe(this._tooltipBalloonContentElem);
			} else {
				console.warn(
					`${ErrorCodes.Tooltip.FailOnSetIntersectionObserver}: The browser in use does not support IntersectionObserver. Tooltip balloon positions wont be properly calculated.`
				);
			}
		}

		// Add the tooltip Events
		private _setUpEvents(): void {
			// If the accessibility feature is enabled
			if (Helper.DeviceInfo.HasAccessibilityEnabled) {
				// Add the focus event in order to show the tooltip balloon when the toolTip content is focused
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			}

			// Add the BodyScroll callback that will be used to update the balloon coodinates
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);
			// Update "animation" before the next repaint
			this._requestAnimationOnBodyScroll = requestAnimationFrame(this._eventOnBodyScroll);

			// Add the window resize callback that will be used update the balloon position!
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnWindowResize
			);
			// Update "animation" before the next repaint
			this._requestAnimationOnWindowResize = requestAnimationFrame(this._eventOnWindowResize);

			// If it's open by default!
			if (this._isOpen) {
				// Add a window event that will be responsible to close it, if it's opend by default
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BodyOnClick,
					this._eventOnBodyClick
				);
			}

			// If tooltip should behave at onMouseClick, or if it's on tablet or phone
			if (this.configs.IsHover === false || Helper.DeviceInfo.IsDesktop === false) {
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
				this._tooltipBalloonContentElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnBalloonClick);
			}

			// If trigger to open the tooltip must be MouseOver (only works at desktop)
			if (this.configs.IsHover && Helper.DeviceInfo.IsDesktop === true) {
				// Set Mouse Hover to the tooltip icon wrapper!
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventIconOnMouseEnter);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventIconOnMouseLeave);

				// Set Mouse Hover to the tooltip balloon!
				this._tooltipBalloonWrapperElem.addEventListener(
					GlobalEnum.HTMLEvent.MouseEnter,
					this._eventBalloonWrapperOnMouseEnter
				);
				this._tooltipBalloonWrapperElem.addEventListener(
					GlobalEnum.HTMLEvent.MouseLeave,
					this._eventBalloonWrapperOnMouseLeave
				);
			}
		}

		// Close the Balloon
		private _triggerClose() {
			// Check if the tooltip is open
			if (this._isOpen) {
				this._isOpen = false;

				// Remove the IsOpned selector
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);

				// Cancel the Observer!
				this._unsetObserver();

				// Reset to the default position!
				if (this._tooltipBalloonPositionClass !== this.configs.Position) {
					// Remove the older vertical position!
					Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, this._tooltipBalloonPositionClass);
					// Store the current position
					this._tooltipBalloonPositionClass = this.configs.Position;
					// Set the new position
					Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, this.configs.Position);
				}

				// Trigger the _platformEventOnToggleCallback callback!
				this.triggerPlatformEventCallback(this._platformEventOnToggleCallback, false);
			}
		}

		// Open the Balloon
		private _triggerOpen() {
			// Check if the tooltip is closed
			if (this._isOpen === false) {
				this._isOpen = true;

				// Get all Tooltips Ids in order to close them!
				/* NOTE: This approach must be follow since we're using a stopPropagation at the 
				click to open we can't use the BodyOnClick to close other open Tooltips! */
				OutSystems.OSUI.Patterns.TooltipAPI.GetAllTooltips().forEach((tpId) => {
					// Get the Tooltip object
					const tp = OutSystems.OSUI.Patterns.TooltipAPI.GetTooltipById(tpId);
					// Check if it's open and not the one has been clicked!
					if (tp.IsOpen && tp.widgetId !== this.widgetId) {
						// Close it!
						tp.close();
					}
				});

				// Unset the Observer if we've it running already!
				this._unsetObserver();
				// Set the Balloon Coordinates
				this._setBalloonCoordinates();
				// Update the balloon position if needed!
				this._setBalloonPosition(false, this._tooltipBalloonContentElem.getBoundingClientRect());

				// wait for _setBalloonPosition ends...
				Helper.AsyncInvocation(() => {
					// Since we're updating the balloon position dynamically, during those momments we do not want animation occur!
					// - Add the selector that will allow annimation occur only during the opening momment!
					Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpening);
					// - Add the event which help on removing the animation after is open
					this._tooltipBalloonContentElem.addEventListener(
						GlobalEnum.HTMLEvent.TransitionEnd,
						this._eventOnOpenedBalloon
					);

					// Add the IsOpned Class Selector
					Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpened);
					Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);
				});

				// Add the Event responsible to close it when click outside!
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BodyOnClick,
					this._eventOnBodyClick
				);

				// ReSet the Observer in order to update it's position if balloon run out of bounds!
				Helper.AsyncInvocation(this._setObserver.bind(this));

				// Trigger the _platformEventOnToggleCallback callback!
				this.triggerPlatformEventCallback(this._platformEventOnToggleCallback, true);

				// Delay the _isOpenedByApi assignement in order to deal with clickOnBody() and open() api concurrency!
				Helper.AsyncInvocation(() => {
					this._isOpenedByApi = false;
				});
			}
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			this._tooltipBalloonContentElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnBalloonClick);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventOnBodyClick
			);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnScroll,
				this._eventOnBodyScroll
			);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnWindowResize
			);

			this._tooltipBalloonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnOpenedBalloon
			);

			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventIconOnMouseEnter);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventIconOnMouseLeave);

			this._tooltipBalloonWrapperElem.removeEventListener(
				GlobalEnum.HTMLEvent.MouseEnter,
				this._eventBalloonWrapperOnMouseEnter
			);
			this._tooltipBalloonWrapperElem.removeEventListener(
				GlobalEnum.HTMLEvent.MouseLeave,
				this._eventBalloonWrapperOnMouseLeave
			);

			cancelAnimationFrame(this._requestAnimationOnBodyScroll);
			cancelAnimationFrame(this._requestAnimationOnWindowResize);

			this._requestAnimationOnBodyScroll = undefined;
			this._requestAnimationOnWindowResize = undefined;
		}

		// Stop Observer
		private _unsetObserver(): void {
			if (this._intersectionObserver !== undefined) {
				this._intersectionObserver.disconnect();
				this._intersectionObserver = undefined;
			}
		}

		// Update Pattern behaviour accordingly IsHover status
		private _updateIsHover(): void {
			if (this.configs.IsHover) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsHover);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsHover);
			}

			// Remove previous added events
			this._unsetEvents();
			// Reset events according to the new position!
			this._setUpEvents();
		}

		// Update Pattern visibility accordingly IsVisible status
		private _updateIsVisible(): void {
			// This will only affect pattern before it's build!
			if (this.isBuilt === false) {
				this._isOpen = this.configs.StartVisible;
			} else {
				console.warn(
					`Tooltip (${this.widgetId}): changes to StartOpen parameter do not affect the tooltip. Use the cliend actions 'TooltipOpen' and 'TooltipClose' to affect the Tooltip.`
				);
			}
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected setA11YProperties(): void {
			// Set Role to the tooltip trigger element
			Helper.A11Y.RoleButton(this._tooltipIconElem);
			// Set Role to the tooltipContent
			Helper.A11Y.RoleTooltip(this._tooltipBalloonWrapperElem);
			// Set AriaDescribedBy to the TooltipBalloon
			Helper.A11Y.AriaDescribedBy(this._tooltipIconElem, this._tooltipBalloonContentElem.id);
			// Set the AriaHidden to the balloon!
			Helper.A11Y.AriaHiddenTrue(this._tooltipBalloonWrapperElem);
			// Set TabIndex to the TooltipTrigger
			Helper.A11Y.TabIndexTrue(this._tooltipIconElem);
		}

		/**
		 * Set the method that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected setCallbacks(): void {
			this._eventOnBalloonClick = this._onBalloonClick.bind(this);
			this._eventOnBlur = this._onBlur.bind(this);
			this._eventOnBodyClick = this._onBodyClick.bind(this);
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this._onFocus.bind(this);
			this._eventOnOpenedBalloon = this._onOpenedBalloon.bind(this);
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);
			this._eventBalloonWrapperOnMouseEnter = this._onBalloonWrapperMouseEnter.bind(this);
			this._eventBalloonWrapperOnMouseLeave = this._onBalloonWrapperMouseLeave.bind(this);
			this._eventIconOnMouseEnter = this._onIconMouseEnter.bind(this);
			this._eventIconOnMouseLeave = this._onIconMouseLeave.bind(this);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected setHtmlElements(): void {
			this._activeScreenElement = Helper.Dom.ClassSelector(
				document.body,
				GlobalEnum.CssClassElements.ActiveScreen
			);
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._tooltipIconElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Content);
			this._tooltipBalloonContentElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonContent);
			this._tooltipBalloonWrapperElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonWrapper);

			// Add Accessibility properties
			this.setA11YProperties();
			// Add the pattern Events
			this._setUpEvents();
			// Set the Initial CSS class selectors
			this._setCssClasses();
			// Ensure that the Move only happens after HTML elements has been set!
			this._moveBalloonElement();
			// Set the balloon coordinates
			this._setBalloonCoordinates();

			// Check if it's open by default!
			if (this._isOpen) {
				// Update the balloon position if needed!
				this._setBalloonPosition(false, this._tooltipBalloonContentElem.getBoundingClientRect());
				// Set the Observer in order to update it's position if balloon is out of bouds!
				Helper.AsyncInvocation(this._setObserver.bind(this));
				// Update the AriaHidden to the balloon!
				Helper.A11Y.AriaHiddenFalse(this._tooltipBalloonWrapperElem);
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected unsetCallbacks(): void {
			this._eventOnBalloonClick = undefined;
			this._eventOnBlur = undefined;
			this._eventOnBodyClick = undefined;
			this._eventOnBodyScroll = undefined;
			this._eventOnClick = undefined;
			this._eventOnFocus = undefined;
			this._eventOnOpenedBalloon = undefined;
			this._eventOnKeypress = undefined;
			this._eventOnWindowResize = undefined;
			this._eventBalloonWrapperOnMouseEnter = undefined;
			this._eventBalloonWrapperOnMouseLeave = undefined;
			this._eventIconOnMouseEnter = undefined;
			this._eventIconOnMouseLeave = undefined;
		}
		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected unsetHtmlElements(): void {
			// Remove the detached balloon html element!
			this._tooltipBalloonWrapperElem.remove();

			// unset the local properties
			this._activeScreenElement = undefined;
			this._tooltipIconElem = undefined;
			this._tooltipBalloonContentElem = undefined;
			this._tooltipBalloonWrapperElem = undefined;
		}

		/**
		 * Method to build the Tooltip
		 *
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public build(): void {
			super.build();
			this.setCallbacks();
			this.setHtmlElements();
			this.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Store previous extended class before change it!
			const prevBalloonExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsHover:
						this._updateIsHover();
						break;

					case Enum.Properties.StartVisible:
						this._updateIsVisible();
						break;

					case Enum.Properties.Position:
						// Remove the old Position CSS Class
						Helper.Dom.Styles.RemoveClass(
							this._tooltipBalloonWrapperElem,
							this._tooltipBalloonPositionClass
						);
						// Set the new one!
						Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, propertyValue as string);
						// Update local current position
						this._tooltipBalloonPositionClass = propertyValue as string;
						break;

					case GlobalEnum.CommonPatternsProperties.ExtendedClass:
						this._setBalloonWrapperExtendedClass(propertyValue as string, prevBalloonExtendedClass);
						break;
				}
			}
		}

		/**
		 * Close the tooltip
		 *
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public close(): void {
			this._triggerClose();
		}

		/**
		 * Destroy the tooltip
		 *
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public dispose(): void {
			this._unsetEvents();
			this._unsetObserver();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		/**
		 * Open the tooltip
		 *
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public open(): void {
			this._isOpenedByApi = true;
			this._triggerOpen();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {GlobalCallbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
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
		 * Getter that allows to obtain the IsOpen status.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public get IsOpen(): boolean {
			return this._isOpen;
		}
	}
}
