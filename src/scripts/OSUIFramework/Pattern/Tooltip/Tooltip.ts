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
		// Event OnClosedBalloon
		private _eventOnClosedBalloon: Callbacks.Generic;
		// Event OnPatternFocus
		private _eventOnFocus: Callbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: Callbacks.Generic;
		// Flag used to manage id it's open or closed!
		private _isOpen: boolean;
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
		private _tooltipBalloonRecomendedPosition = '';
		private _tooltipBalloonWrapperElem: HTMLElement;
		private _tooltipIconElem: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TooltipConfig(configs));

			this._isOpen = this.configs.StartVisible;
		}

		// Check the recomended position to open the balloon
		private _getRecomendedPosition(): void {
			// Get the Boundaries for the balloon container
			const balloonBounds = this._tooltipBalloonContentElem.getBoundingClientRect();

			// Get the recomended position to open the balloon
			const recomendedPosition = Helper.BoundPosition.GetRecomendedPositionByBounds(
				balloonBounds,
				document.body.getBoundingClientRect()
			);

			// Check if there are a any recomended position
			if (recomendedPosition !== undefined) {
				// If the recomendedPosition is differently the position assigned...
				if (recomendedPosition !== this.configs.Position) {
					// Remove the older position
					Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, this.configs.Position);
				}
				// Update the recomended Position!
				this._tooltipBalloonRecomendedPosition = recomendedPosition as GlobalEnum.Position;
				// Set the new one
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, recomendedPosition);
			} else if (
				this._tooltipBalloonRecomendedPosition !== '' &&
				this._tooltipBalloonRecomendedPosition !== this.configs.Position
			) {
				// Remove the older position
				Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, this._tooltipBalloonRecomendedPosition);
				// Reset to the default one!
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, this.configs.Position);

				// Clear oldRecomendedPosition
				this._tooltipBalloonRecomendedPosition = '';
			}
		}

		// Move balloon element to outside of the pattern context
		private _moveBalloonElement(): void {
			const layoutElement = Helper.Dom.ClassSelector(document.body, GlobalEnum.CssClassElements.Layout);
			Helper.Dom.Move(this._tooltipBalloonWrapperElem, layoutElement);

			// Wait for next activeElement be active
			Helper.AsyncInvocation(() => {
				this._getRecomendedPosition();
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
			// If the balloon is open and not IsPhone
			if (this._isOpen) {
				// Update the coordinates
				this._setBalloonCoordinates();
				// Update/Get the recomended position
				this._getRecomendedPosition();
				// Update the "animation" before the next repaint
				this._rafOnBodyScroll = requestAnimationFrame(this._eventOnBodyScroll);
			}
		}

		// Trigger the tooltip at onClick behaviour
		private _onClick(e: MouseEvent): void {
			e.stopPropagation();
			this._triggerOpen();
		}

		// Used to update the tooltip position after it's closed
		private _onClosedBalloon(): void {
			// Trigger the _platformEventOnToggleCallback callback!
			Helper.AsyncInvocation(this._platformEventOnToggleCallback, this.widgetId, false);

			// Remove the transition event!
			this._tooltipBalloonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnClosedBalloon
			);

			// Update/Get the recomended position
			this._getRecomendedPosition();
		}

		// Open the tooltip
		private _onFocus(): void {
			this._triggerOpen();
		}

		// Manage the behaviour when there is a window resize!
		private _onWindowResize(): void {
			// If there is a horizontal resize and the Dropdown is open, close it!
			if (this._isOpen) {
				// Update Coordinates
				this._setBalloonCoordinates();
				// Check the recomended position
				this._getRecomendedPosition();
				// Update the "animation" before the next repaint
				this._rafOnWindowResize = requestAnimationFrame(this._eventOnWindowResize);
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

			// Set default Position cssClass property value
			Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, this.configs.Position);
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

			// If tooltip should behave onMouseOver and it's visible by default
			if (this.configs.IsHover || this._isOpen) {
				// Add a window event that will be responsible to close it, if it's opend by default
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);
			}

			// If tooltip should behave at onMouseClick, or if it's on tablet or phone
			if (this.configs.IsHover === false || Helper.DeviceInfo.IsDesktop === false) {
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			}
		}

		// Close the Balloon
		private _triggerClose() {
			// Check if the tooltip is open
			if (this._isOpen) {
				this._isOpen = false;

				// Add the transition envent in order to trigger the closeCallback only after totally closed!
				this._tooltipBalloonContentElem.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnClosedBalloon
				);

				// Remove the IsOpned selector
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);
			}
		}

		// Open the Balloon
		private _triggerOpen() {
			// Check if the tooltip is closed
			if (this._isOpen === false) {
				this._isOpen = true;

				// Set the Balloon Coordinates
				this._setBalloonCoordinates();

				// Check if the balloon could be opened at the place it's defined!
				this._getRecomendedPosition();

				// Add the Event responsible to close it when click outside!
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOnBodyClick);

				// Add the IsOpned Class Selector
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);

				// Trigger the _platformEventOnToggleCallback callback!
				Helper.AsyncInvocation(this._platformEventOnToggleCallback, this.widgetId, true);

				// Get all Tooltips Ids in order to close them!
				/* NOTE: This approach must be follow since we're using a stopPropagation at the 
			click to open moment we can't use the BodyOnClick to close other open Tooltips! */
				OutSystems.OSUI.Patterns.TooltipAPI.GetAllTooltips().forEach((tpId) => {
					// Get the Tooltip object
					const tp = OutSystems.OSUI.Patterns.TooltipAPI.GetTooltipById(tpId);
					// Check if it's open and not the one has been clicked!
					if (tp.IsOpen && tp.widgetId !== this.widgetId) {
						// Close it!
						tp.close();
					}
				});
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
				this._eventOnClosedBalloon
			);

			cancelAnimationFrame(this._rafOnBodyScroll);
			cancelAnimationFrame(this._rafOnWindowResize);
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
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this._onFocus.bind(this);
			this._eventOnBodyClick = this._onBodyClick.bind(this);
			this._eventOnBodyScroll = this._onBodyScroll.bind(this);
			this._eventOnClosedBalloon = this._onClosedBalloon.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);
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
			this._eventOnClick = undefined;
			this._eventOnFocus = undefined;
			this._eventOnBodyClick = undefined;
			this._eventOnBodyScroll = undefined;
			this._eventOnClosedBalloon = undefined;
			this._eventOnWindowResize = undefined;
		}
		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected unsetHtmlElements(): void {
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
			// Store the current position, before possibly changing this property.
			// This will enable us to remove the previous added classes to the element.
			const oldPosition = this.configs.Position;

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
						Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, oldPosition);
						// Set the new one!
						Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, propertyValue as string);
						// Check if the new poition can be set!
						this._getRecomendedPosition();
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
