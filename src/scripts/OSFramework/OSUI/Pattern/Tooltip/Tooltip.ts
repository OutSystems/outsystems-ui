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
		// Event OnPatternClick
		private _eventOnClick: GlobalCallbacks.Generic;
		// Event OnPatternFocus
		private _eventOnFocus: GlobalCallbacks.Generic;
		// Flag used to manage if it's open or closed!
		private _isOpen: boolean;
		// Flag used to deal with onBodyClick and open api concurrency methods!
		private _isOpenedByApi = false;
		// Platform OnClose Callback
		private _platformEventOnToggleCallback: GlobalCallbacks.OSGeneric;
		// Store the HTML elements
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
			if (e.detail.balloonElem === this._balloonElem && e.detail.isOpen) {
				this._isOpen = false;
			}
		}

		// Trigger the tooltip at onClick behaviour
		private _onClick(e: MouseEvent): void {
			e.stopPropagation();
			this._triggerOpen();
		}

		// Open the tooltip
		private _onFocus(e: FocusEvent): void {
			console.log(e);
			if (document.activeElement === this._tooltipIconElem && this.IsOpen === false) {
				this._triggerOpen();
			}
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
				this._tooltipIconElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
				this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
			}

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);
		}

		// Close the Balloon
		private _triggerClose() {
			// Check if the tooltip is open
			if (this._isOpen) {
				this._balloonFeature.close();
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
			this._tooltipIconElem.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);

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
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this._onFocus.bind(this);
			this._eventBalloonOnToggle = this._balloonOnToggleCallback.bind(this);
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
			this._eventOnClick = undefined;
			this._eventOnFocus = undefined;
			this._eventBalloonOnToggle = undefined;
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
			console.log('localhost');
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
						this._balloonFeature.updatePositionOption(propertyValue as GlobalEnum.FloatingPosition);
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

		public setBalloonOptions(balloonOptions?: Feature.Balloon.BalloonOptions): void {
			if (balloonOptions !== undefined) {
				this.balloonOptions = balloonOptions;
			} else {
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
					position: this.configs.Position,
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
