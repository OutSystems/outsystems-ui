// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Balloon {
	/**
	 * Class that implements the Balloon pattern.
	 *
	 * @export
	 * @class Balloon
	 * @extends {AbstractPattern<BalloonConfig>}
	 * @implements {IBalloon}
	 */
	export class Balloon extends AbstractPattern<BalloonConfig> implements IBalloon {
		// Listener callbacks
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIInstance: Providers.OSUI.Utils.FloatingUI;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		private _focusableActiveElement: HTMLElement;
		// Store if the pattern is open
		private _isOpen = false;
		// WidgetId element
		private _parentSelf: HTMLElement;
		private _platformEventInitialized: GlobalCallbacks.Generic;
		private _platformEventOnToggle: GlobalCallbacks.Generic;
		public anchorElem: HTMLElement;
		public floatingOptions: Providers.OSUI.Utils.FloatingUIOptions;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BalloonConfig(configs));
		}

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		// Method to handle the Shape config css variable
		private _handleShape(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + this.configs.Shape + ')'
			);
		}

		// Call methods to open or close, based on e.key and behaviour applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Balloon when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.close();
			}
		}

		// Method to toggle the open/close the Balloon
		private _toggleBalloon(isOpen: boolean): void {
			// Toggle class
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.IsOpen);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClasses.IsOpen);
			}

			// Update property
			this._isOpen = isOpen;

			// Update listeners and A11y properties
			if (isOpen) {
				this.setFloatingBehaviour();
				this.setEventListeners();
			} else {
				this._floatingUIInstance.close();
				this.removeEventListeners();
			}

			this.setA11YProperties();

			// Handle focus trap logic
			if (isOpen) {
				this._focusableActiveElement = document.activeElement as HTMLElement;
				this._focusTrapInstance.enableForA11y();
				// Focus on element when pattern is open
				this.selfElement.focus();
			} else {
				this._focusTrapInstance.disableForA11y();

				// Focus on last element clicked. Async to avoid conflict with closing animation
				Helper.AsyncInvocation(() => {
					this.selfElement.blur();
					this._focusableActiveElement.focus();
				});
			}

			// Trigger platform event
			this._triggerOnToggleEvent();
		}

		// Method that triggers the Intialized event
		private _triggerInitializedEvent(): void {
			Helper.AsyncInvocation(this._platformEventInitialized, this.widgetId);
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			Helper.AsyncInvocation(this._platformEventOnToggle, this.widgetId, this._isOpen);
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected removeEventListeners(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setA11YProperties(): void {
			if (!this.isBuilt) {
				//Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.Role.Complementary, true);
			}

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Aria.Hidden,
				(!this._isOpen).toString()
			);

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.TabIndex,
				this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this._isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setCallbacks(): void {
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
		}

		/**
		 * Method to add event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setEventListeners(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
		}

		protected setFloatingBehaviour(isUpdate = false): void {
			if (this._floatingUIInstance === undefined || isUpdate) {
				this.floatingOptions = {
					autoPlacement: this.configs.Position === GlobalEnum.FloatingPosition.Auto,
					anchorElem: this.anchorElem,
					autoPlacementOptions: {
						placement: this.configs.Alignment,
						allowedPlacements: this.configs.AllowedPlacements,
					},
					floatingElem: this.selfElement,
					position: this.configs.Position,
					useShift: true,
					updatePosition: true,
				};

				if (isUpdate && this._floatingUIInstance !== undefined) {
					this._floatingUIInstance.update(this.floatingOptions);
				}

				this._floatingUIInstance = new Providers.OSUI.Utils.FloatingUI(this.floatingOptions);
			} else {
				this._floatingUIInstance.build();
			}
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);
			this.anchorElem = document.getElementById(this.configs.AnchorId);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetCallbacks(): void {
			this._eventOnKeypress = undefined;
			this._platformEventOnToggle = undefined;
			this._platformEventInitialized = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this.anchorElem = undefined;
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this._handleShape();
			this._handleFocusTrap();
			this.setA11YProperties();
			this.finishBuild();
			this._triggerInitializedEvent();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.AnchorId:
						this.setHtmlElements();
						this.setFloatingBehaviour();
						break;
					case Enum.Properties.BalloonPosition:
						this.setFloatingBehaviour();
						break;
					case Enum.Properties.BalloonShape:
						this._handleShape();
				}
			}
		}

		public close(): void {
			if (this._isOpen) {
				this._toggleBalloon(false);
			}
		}

		/**
		 * Destroy the Balloon.
		 *
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public dispose(): void {
			this._floatingUIInstance.dispose();

			// Remove focus trap events and callbacks
			this._focusTrapInstance.dispose();

			if (this._isOpen) {
				this.removeEventListeners();
			}

			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		public open(): void {
			if (this._isOpen === false) {
				this._toggleBalloon(true);
			}
		}

		/**
		 * Set callbacks for the pattern events
		 *
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @param {string} eventName
		 * @memberof Balloon
		 */
		public registerCallback(callback: GlobalCallbacks.OSGeneric, eventName: string): void {
			switch (eventName) {
				case Enum.Events.Initialized:
					if (this._platformEventInitialized === undefined) {
						this._platformEventInitialized = callback;
					} else {
						console.warn(
							`The ${GlobalEnum.PatternName.Balloon} already has the ${eventName} callback set.`
						);
					}
					break;
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					} else {
						console.warn(
							`The ${GlobalEnum.PatternName.Balloon} already has the ${eventName} callback set.`
						);
					}
					break;
			}
		}
	}
}
