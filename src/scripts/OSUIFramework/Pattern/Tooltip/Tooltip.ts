// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Event OnPatternBlur (combined with focus)
		private _eventOnBlur: Callbacks.Generic;
		// Event OnBodyClick
		private _eventOnBodyClick: Callbacks.Generic;
		// Event OnBodyScroll
		private _eventOnBodyScroll: Callbacks.Generic;
		// Event OnPatternClick
		private _eventOnClick: Callbacks.Generic;
		// Event OnPatternFocus
		private _eventOnFocus: Callbacks.Generic;
		// Event OnOpendBalloon
		private _eventOnOpenedBalloon: Callbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: Callbacks.Generic;
		// Event OnMouseEnter at _tooltipBalloonWrapperElem (Tpbwe)
		private _eventTpbweOnMouseEnter: Callbacks.Generic;
		// Event OnMouseLeave at at _tooltipBalloonWrapperElem (Tpbwe)
		private _eventTpbweOnMouseLeave: Callbacks.Generic;
		// Event OnMouseEnter at _tooltipIconElem (Tpie)
		private _eventTpieOnMouseEnter: Callbacks.Generic;
		// Event OnMouseLeave at at _tooltipIconElem (Tpie)
		private _eventTpieOnMouseLeave: Callbacks.Generic;
		// Set the observer that will check if the balloon is inside screen boundaries!
		private _iObserver: IntersectionObserver;
		// Flag used to manage if it's open or closed!
		private _isOpen: boolean;
		// Flag used to manage if it's _tooltipBalloonWrapperElem (Tpbwe) has been MouseEnter
		private _isTpbweMouseEnter = false;
		// Flag used to manage if it's _tooltipIconElem (Tpie) has been MouseEnter
		private _isTpieMouseEnter = false;
		// Platform OnInitialize Callback
		private _platformEventInitializedCallback: Callbacks.OSGeneric;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: Callbacks.OSGeneric;
		// Store the RequestAnimationFrame (aka raf) that will be triggered at OnBodyScroll
		private _rafOnBodyScroll: number;
		// Store the RequestAnimationFrame (aka raf) that will be triggered at OnWindowResize
		private _rafOnWindowResize: number;
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

		// Move balloon element to outside of the pattern context
		private _moveBalloonElement(): void {
			const layoutElement = Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.Layout);
			Helper.Dom.Move(this._tooltipBalloonWrapperElem, layoutElement);
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
				if (_closestElem !== this._selfElem) {
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
		private _onBodyClick(eventName: string, e: MouseEvent): void {
			if (this.isBuilt) {
				const _clickedElem = e.target as HTMLElement;
				const _closestElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);
				const _closestBalloonElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.BalloonWrapper);

				// If the click has occur outside of this tooltip, or tooltipBalloon!
				if (_closestElem !== this._selfElem && _closestBalloonElem !== this._tooltipBalloonWrapperElem) {
					// Remove the Event
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);

					// Close Tooltip
					this._triggerClose();
				}
			}
		}

		// Update the balloon coordinates
		private _onBodyScroll(): void {
			if (this.isBuilt) {
				// Update the coordinates
				this._setBalloonCoordinates();

				// If the balloon is open and not IsPhone
				if (this._isOpen) {
					// Update the "animation" before the next repaint
					this._rafOnBodyScroll = requestAnimationFrame(this._eventOnBodyScroll);
				} else {
					cancelAnimationFrame(this._rafOnBodyScroll);
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

		// OnMouseLeave at _tooltipBalloonWrapperElem (Tpbwe)
		private _onTpbweMouseLeave(): void {
			this._isTpbweMouseEnter = false;

			setTimeout(() => {
				if (this._isTpieMouseEnter === false) {
					this._triggerClose();
				}
			}, 0);
		}

		// OnMouseEnter at _tooltipBalloonWrapperElem (Tpbwe)
		private _onTpbweOnMouseEnter(): void {
			this._isTpbweMouseEnter = true;
		}

		// OnMouseLeave at _tooltipIconElem (Tpie)
		private _onTpieMouseLeave(): void {
			this._isTpieMouseEnter = false;

			setTimeout(() => {
				if (this._isTpbweMouseEnter === false) {
					this._triggerClose();
				}
			}, 0);
		}

		// OnMouseEnter at _tooltipIconElem (Tpie)
		private _onTpieOnMouseEnter(): void {
			this._isTpieMouseEnter = true;

			if (this.IsOpen === false) {
				this._triggerOpen();
			}
		}

		// Manage the behaviour when there is a window resize!
		private _onWindowResize(): void {
			// Update Coordinates
			this._setBalloonCoordinates();

			// If there is a horizontal resize and the Dropdown is open, close it!
			if (this._isOpen) {
				// Update the "animation" before the next repaint
				this._rafOnWindowResize = requestAnimationFrame(this._eventOnWindowResize);
			} else {
				cancelAnimationFrame(this._rafOnWindowResize);
			}
		}

		// Set balloon position and coordinates based on pattern SelfElement
		private _setBalloonCoordinates(): void {
			// Get all info from the pattern self element
			const selfElement = this._selfElem.getBoundingClientRect();

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
			if (isIntersecting || this.IsOpen === false) {
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
					recommendedPosition === GlobalEnum.Position.Top ||
					recommendedPosition === GlobalEnum.Position.Bottom
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
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHover);
			}

			// Set default IsVisible cssClass property value
			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpened);
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
				this._iObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							this._setBalloonPosition(entry.isIntersecting, entry.boundingClientRect);
						});
					},
					{ threshold: 1 }
				);

				// Start observing it!
				this._iObserver.observe(this._tooltipBalloonContentElem);
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
			}

			// Add the BodyScroll callback that will be used to update the balloon coodinates
			Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnScroll, this._eventOnBodyScroll);
			// Update "animation" before the next repaint
			this._rafOnBodyScroll = requestAnimationFrame(this._eventOnBodyScroll);

			// Add the window resize callback that will be used update the balloon position!
			Event.GlobalEventManager.Instance.addHandler(Event.Type.WindowResize, this._eventOnWindowResize);
			// Update "animation" before the next repaint
			this._rafOnWindowResize = requestAnimationFrame(this._eventOnWindowResize);

			// If it's open by default!
			if (this._isOpen) {
				// Add a window event that will be responsible to close it, if it's opend by default
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);
			}

			// If tooltip should behave at onMouseClick, or if it's on tablet or phone
			if (this.configs.IsHover === false || Helper.DeviceInfo.IsDesktop === false) {
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			}

			// If trigger to open the tooltip must be MouseOver (only works at desktop)
			if (this.configs.IsHover && Helper.DeviceInfo.IsDesktop === true) {
				// Set Mouse Hover to the tooltip icon wrapper!
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventTpieOnMouseEnter);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventTpieOnMouseLeave);

				// Set Mouse Hover to the tooltip balloon!
				this._tooltipBalloonWrapperElem.addEventListener(
					GlobalEnum.HTMLEvent.MouseEnter,
					this._eventTpbweOnMouseEnter
				);
				this._tooltipBalloonWrapperElem.addEventListener(
					GlobalEnum.HTMLEvent.MouseLeave,
					this._eventTpbweOnMouseLeave
				);
			}
		}

		// Close the Balloon
		private _triggerClose() {
			// Check if the tooltip is open
			if (this._isOpen) {
				this._isOpen = false;

				// Remove the IsOpned selector
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpened);
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
				Helper.AsyncInvocation(this._platformEventOnToggleCallback, this.widgetId, false);
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

				// Since we're updating the balloon position dynamically, during those momments we do not want animation occur!
				// - Add the selector that will allow annimation occur only during the opening momment!
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpening);
				// - Add the event which help on removing the animation after is open
				this._tooltipBalloonContentElem.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnOpenedBalloon
				);

				// Unset the Observer if we've it running already!
				this._unsetObserver();
				// Set the Balloon Coordinates
				this._setBalloonCoordinates();
				// Update the balloon position if needed!
				this._setBalloonPosition(false, this._tooltipBalloonContentElem.getBoundingClientRect());

				// wait for BalloonPosition end...
				Helper.AsyncInvocation(() => {
					// Add the IsOpned Class Selector
					Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpened);
					Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);
				});

				// Add the Event responsible to close it when click outside!
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);

				// Set the Observer in order to update it's position if balloon is out of bouds!
				Helper.AsyncInvocation(this._setObserver.bind(this));

				// Trigger the _platformEventOnToggleCallback callback!
				Helper.AsyncInvocation(this._platformEventOnToggleCallback, this.widgetId, true);
			}
		}

		// Remove Pattern Events
		private _unsetEvents(): void {
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);

			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnScroll, this._eventOnBodyScroll);

			Event.GlobalEventManager.Instance.removeHandler(Event.Type.WindowResize, this._eventOnWindowResize);

			this._tooltipBalloonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnOpenedBalloon
			);

			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventTpieOnMouseEnter);
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventTpieOnMouseLeave);

			this._tooltipBalloonWrapperElem.removeEventListener(
				GlobalEnum.HTMLEvent.MouseEnter,
				this._eventTpbweOnMouseEnter
			);
			this._tooltipBalloonWrapperElem.removeEventListener(
				GlobalEnum.HTMLEvent.MouseLeave,
				this._eventTpbweOnMouseLeave
			);

			cancelAnimationFrame(this._rafOnBodyScroll);
			cancelAnimationFrame(this._rafOnWindowResize);

			this._rafOnBodyScroll = undefined;
			this._rafOnWindowResize = undefined;
		}

		// Stop Observer
		private _unsetObserver(): void {
			if (this._iObserver !== undefined) {
				this._iObserver.disconnect();
				this._iObserver = undefined;
			}
		}

		// Update Pattern behaviour accordingly IsHover status
		private _updateIsHover(): void {
			if (this.configs.IsHover) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHover);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsHover);
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
		 * @memberof Tooltip
		 */
		protected setA11YProperties(): void {
			// Set Role to the tooltipContent
			Helper.A11Y.RoleTooltip(this._tooltipIconElem);
			// Set Aria Label to the tooltipContent
			Helper.A11Y.AriaLabel(this._tooltipIconElem, Enum.AriaLabelText.Content);
			// Set TabIndex to the TooltipBalloon
			Helper.A11Y.TabIndexTrue(this._tooltipIconElem);
			// Set AriaDescribedBy to the TooltipBalloon
			Helper.A11Y.AriaDescribedBy(this._tooltipIconElem, this._tooltipBalloonWrapperElem.id);
			// Set LabelledBy to the TooltipBalloon
			Helper.A11Y.AriaLabelledBy(this._tooltipIconElem, this._tooltipBalloonWrapperElem.id);
		}

		/**
		 * Set the method that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected setCallbacks(): void {
			this._eventOnBlur = this._onBlur.bind(this);
			this._eventOnBodyClick = this._onBodyClick.bind(this);
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this._onFocus.bind(this);
			this._eventOnOpenedBalloon = this._onOpenedBalloon.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);
			this._eventTpbweOnMouseEnter = this._onTpbweOnMouseEnter.bind(this);
			this._eventTpbweOnMouseLeave = this._onTpbweMouseLeave.bind(this);
			this._eventTpieOnMouseEnter = this._onTpieOnMouseEnter.bind(this);
			this._eventTpieOnMouseLeave = this._onTpieMouseLeave.bind(this);
		}

		// Update info based on htmlContent
		protected setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._tooltipIconElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.Content);
			this._tooltipBalloonContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.BalloonContent);
			this._tooltipBalloonWrapperElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.BalloonWrapper);

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
			if (this.IsOpen) {
				// Update the balloon position if needed!
				this._setBalloonPosition(false, this._tooltipBalloonContentElem.getBoundingClientRect());
				// Set the Observer in order to update it's position if balloon is out of bouds!
				Helper.AsyncInvocation(this._setObserver.bind(this));
			}

			// Trigger platform's _platformEventInitializedCallback client Action
			Helper.AsyncInvocation(this._platformEventInitializedCallback, this.widgetId);
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected unsetCallbacks(): void {
			this._eventOnBlur = undefined;
			this._eventOnBodyClick = undefined;
			this._eventOnBodyScroll = undefined;
			this._eventOnClick = undefined;
			this._eventOnFocus = undefined;
			this._eventOnOpenedBalloon = undefined;
			this._eventOnWindowResize = undefined;
			this._eventTpbweOnMouseEnter = undefined;
			this._eventTpbweOnMouseLeave = undefined;
			this._eventTpieOnMouseEnter = undefined;
			this._eventTpieOnMouseLeave = undefined;
		}
		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected unsetHtmlElements(): void {
			// Remove the detached balloon html element!
			this._tooltipBalloonWrapperElem.remove();

			this._tooltipIconElem = undefined;
			this._tooltipBalloonContentElem = undefined;
			this._tooltipBalloonWrapperElem = undefined;
		}

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
		 * @memberof Tooltip
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
		 * @memberof Tooltip
		 */
		public close(): void {
			this._triggerClose();
		}

		/**
		 * Destroy the tooltip
		 *
		 * @memberof Tooltip
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
		 * @memberof Tooltip
		 */
		public open(): void {
			this._triggerOpen();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof Tooltip
		 */
		public registerCallback(eventName: string, callback: Callbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.Initialized:
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
						`${ErrorCodes.Tooltip.FailRegisterCallback}: The given '${eventName}' event name is not defined.`
					);
			}
		}

		/**
		 * Getter that allows to obtain the IsOpen status.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof Tooltip
		 */
		public get IsOpen(): boolean {
			return this._isOpen;
		}
	}
}
