// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tooltip {
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Store the Arrow Element
		private _arrowElem: HTMLElement;
		// Store the Balloon Element
		private _balloonElem: HTMLElement;
		// Store the Balloon Class instance
		private _balloonFeature: Feature.Balloon.IBalloon;
		// Custom Balloon Event
		private _eventBalloonOnToggle: GlobalCallbacks.Generic;
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
		// Event OnPatternClick
		private _eventOnClick: GlobalCallbacks.Generic;
		// Event OnPatternFocus
		private _eventOnFocus: GlobalCallbacks.Generic;
		// Event OnPatternKeypress
		private _eventOnKeypress: GlobalCallbacks.Generic;
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
		// Store the HTML elements
		private _tooltipBalloonContentActiveElem: HTMLElement;
		private _tooltipBalloonContentElem: HTMLElement;
		private _tooltipBalloonWrapperElem: HTMLElement;
		private _tooltipIconElem: HTMLElement;
		// Store the Balloon options to pass to the Balloon Class
		public balloonOptions: Feature.Balloon.BalloonOptions;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TooltipConfig(configs));

			this._isOpen = this.configs.StartVisible;
		}

		// Method to handle the custom BalloonOnToggle callback
		private _balloonOnToggleCallback(_args: string, e: CustomEvent): void {
			// If the balloon closed is the one from this pattern, toggle the isOpen
			if (e.detail.balloonElem === this._balloonElem && e.detail.isOpen !== this._isOpen) {
				this._triggerClose(true);
			}
		}

		// Check if a clickable item has been clicked, otherwise stop the propagation!
		private _onBalloonClick(e: MouseEvent): void {
			// Get all possible clickable items inside tooltip balloon
			const clickableItems = Array.from(
				this._tooltipBalloonContentElem.querySelectorAll(
					Constants.FocusableElems + ', ' + GlobalEnum.HTMLAttributes.AllowEventPropagation
				)
			);

			// Flag used to help on go through all the clickable items to ensure we check all!
			let _childHasClickEvent = false;

			// Check each clickable item
			for (const item of clickableItems) {
				// If the clicked item exist as a clickableItem!
				if (e.target === item) {
					_childHasClickEvent = true;
					break;
				}
			}

			// If we found the clicked item does not exist as a clickableItem, do no let the click be propagated!
			if (_childHasClickEvent === false) {
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
				if (
					_closestElem !== this.selfElement &&
					_closestElem?.contains(_closestElem.querySelector(Constants.AllowPropagationAttr)) === false
				) {
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

		// Call methods to open or close, based on e.key and behaviour applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			if ((this._isOpen && e.key === GlobalEnum.Keycodes.Escape) || e.key === GlobalEnum.Keycodes.Tab) {
				// Close the Balloon when pressing Esc
				this.close();
			}
			e.stopPropagation();
		}

		// Method to call the Balloon Class
		private _setBalloonFeature(): void {
			this.setBalloonOptions();

			this._balloonFeature = new OSFramework.OSUI.Feature.Balloon.Balloon<ITooltip>(
				this,
				this._balloonElem,
				this.balloonOptions
			);
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
		}

		// Add the tooltip Events
		private _setUpEvents(): void {
			if (this.configs.IsHover === false) {
				// Add the focus event in order to show the tooltip balloon when the toolTip content is focused
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			}

			// If tooltip should behave at onMouseClick, or if it's on tablet or phone
			if (this.configs.IsHover === false || Helper.DeviceInfo.IsDesktop === false) {
				this._tooltipBalloonContentElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnBalloonClick);
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
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

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);
		}

		// Method to translate the tooltip Position config to the expected Floating Position
		private _transformPosition(tooltipPosition: GlobalEnum.Position): GlobalEnum.FloatingPosition {
			let _finalPosition;

			switch (tooltipPosition) {
				case GlobalEnum.Position.BottomLeft:
					_finalPosition = GlobalEnum.FloatingPosition.BottomStart;
					break;
				case GlobalEnum.Position.TopLeft:
					_finalPosition = GlobalEnum.FloatingPosition.TopStart;
					break;
				case GlobalEnum.Position.BottomRight:
					_finalPosition = GlobalEnum.FloatingPosition.BottomEnd;
					break;
				case GlobalEnum.Position.TopRight:
					_finalPosition = GlobalEnum.FloatingPosition.TopEnd;
					break;
				// The following one is to avoid issues with the center position and trigger click and also maintain the same behaviour of previous positon logic
				case GlobalEnum.Position.Center:
					_finalPosition = GlobalEnum.FloatingPosition.Bottom;
					break;
				default:
					_finalPosition = tooltipPosition;
			}

			return _finalPosition;
		}

		// Close the Balloon
		private _triggerClose(isFromBalloonEvent = false) {
			// Check if the tooltip is open
			if (this._isOpen) {
				if (!isFromBalloonEvent) {
					this._balloonFeature.close();
				}

				this._isOpen = false;

				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.RemoveClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);

				// Trigger the _platformEventOnToggleCallback callback!
				this.triggerPlatformEventCallback(this._platformEventOnToggleCallback, false);
			}
		}

		// Open the Balloon
		private _triggerOpen() {
			// Check if the tooltip is closed
			if (this._isOpen === false) {
				this._balloonFeature.open(this._isOpenedByApi, GlobalEnum.Keycodes.ArrowDown);
				this._isOpen = true;

				// Add the IsOpned Class Selector
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpened);
				Helper.Dom.Styles.AddClass(this._tooltipBalloonWrapperElem, Enum.CssClass.BalloonIsOpened);

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

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);
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

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected setA11YProperties(): void {
			// Set Role to the tooltip trigger element
			Helper.A11Y.RoleButton(this._tooltipIconElem);
			// Set AriaDescribedBy to the TooltipBalloon
			Helper.A11Y.AriaDescribedBy(this._tooltipIconElem, this._tooltipBalloonContentElem.id);
			// Set TabIndex to the TooltipTrigger
			Helper.A11Y.TabIndexTrue(this._tooltipIconElem);
			// Set Role to the tooltipContent
			Helper.A11Y.RoleTooltip(this._tooltipBalloonWrapperElem);
		}

		/**
		 * Set the method that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected setCallbacks(): void {
			this._eventBalloonOnToggle = this._balloonOnToggleCallback.bind(this);
			this._eventOnBalloonClick = this._onBalloonClick.bind(this);
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnBlur = this._onBlur.bind(this);
			this._eventOnFocus = this._onFocus.bind(this);
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
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
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._arrowElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Arrow);
			this._tooltipIconElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Content);
			this._tooltipBalloonContentElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonContent);
			this._tooltipBalloonWrapperElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.BalloonWrapper);
			this._balloonElem = this._tooltipBalloonWrapperElem;
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		protected unsetCallbacks(): void {
			this._eventBalloonOnToggle = undefined;
			this._eventOnBalloonClick = undefined;
			this._eventOnBlur = undefined;
			this._eventOnClick = undefined;
			this._eventOnFocus = undefined;
			this._eventOnKeypress = undefined;
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
			// unset the local properties
			this._arrowElem = undefined;
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
			this.setA11YProperties();
			this._setUpEvents();
			this._setCssClasses();
			this._setBalloonFeature();
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
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsHover:
						this._updateIsHover();
						break;

					case Enum.Properties.StartVisible:
						console.warn(
							`Tooltip (${this.widgetId}): changes to StartOpen parameter do not affect the tooltip. Use the cliend actions 'TooltipOpen' and 'TooltipClose' to affect the Tooltip.`
						);
						break;

					case Enum.Properties.Position:
						if (propertyValue !== Constants.EmptyString) {
							this._balloonFeature.updatePositionOption(
								this._transformPosition(propertyValue as GlobalEnum.Position)
							);
						}
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
			if (this._balloonFeature.isOpen) {
				this._triggerClose();
			}
		}

		/**
		 * Destroy the tooltip
		 *
		 * @memberof OSFramework.Patterns.Tooltip.Tooltip
		 */
		public dispose(): void {
			this._unsetEvents();
			this._balloonFeature?.dispose();
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
			if (this._balloonFeature.isOpen === false) {
				this._isOpenedByApi = true;
				this._triggerOpen();
			}
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
		 * Method to set the Balloon options
		 *
		 * @param {Feature.Balloon.BalloonOptions} [balloonOptions]
		 * @memberof Tooltip
		 */
		public setBalloonOptions(balloonOptions?: Feature.Balloon.BalloonOptions): void {
			if (balloonOptions !== undefined) {
				this.balloonOptions = balloonOptions;
			} else {
				// Set focus options to pass to the Balloon feature
				const _focusOptions = {
					useFocus: false,
				};

				this.balloonOptions = {
					alignment: GlobalEnum.FloatingAlignment.Start,
					anchorElem: this._tooltipIconElem,
					arrowElem: this._arrowElem,
					allowedPlacements: [
						GlobalEnum.FloatingPosition.Right,
						GlobalEnum.FloatingPosition.Top,
						GlobalEnum.FloatingPosition.Left,
						GlobalEnum.FloatingPosition.Bottom,
						GlobalEnum.FloatingPosition.BottomEnd,
						GlobalEnum.FloatingPosition.BottomStart,
						GlobalEnum.FloatingPosition.TopEnd,
						GlobalEnum.FloatingPosition.TopStart,
						GlobalEnum.FloatingPosition.Center,
					],
					focusOptions: _focusOptions,
					position: this._transformPosition(this.configs.Position),
					shape: GlobalEnum.ShapeTypes.Sharp,
				};
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
