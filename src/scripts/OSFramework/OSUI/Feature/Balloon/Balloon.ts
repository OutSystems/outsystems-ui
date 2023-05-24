// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	export type BalloonOptions = {
		alignment: GlobalEnum.FloatingAlignment;
		allowedPlacements: Array<GlobalEnum.FloatingPosition>;
		anchorElem: HTMLElement;
		position: GlobalEnum.FloatingPosition;
		shape: GlobalEnum.ShapeTypes;
	};

	export class Balloon<PT> extends AbstractFeature<PT, BalloonOptions> implements IBalloon {
		// Listener callbacks
		private _eventBodyClick: GlobalCallbacks.Generic;
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIInstance: Providers.OSUI.Utils.FloatingUI;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIOptions: Providers.OSUI.Utils.FloatingUIOptions;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		private _focusableActiveElement: HTMLElement;
		private _onToggleEvent: GlobalCallbacks.Generic;
		// Store if the pattern is open
		public isOpen = false;

		constructor(featurePattern: PT, featureElem: HTMLElement, options: BalloonOptions) {
			super(featurePattern, featureElem, options);
			this.build();
		}

		private _bodyClickCallback(_args: string, e: MouseEvent): void {
			if (e.target === this.featureOptions.anchorElem) {
				return;
			}
			this.close();
			e.stopPropagation();
		}

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this._floatingUIOptions.anchorElem.parentElement,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		// Call methods to open or close, based on e.key and behaviour applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Balloon when pressing Esc
			if (isEscapedPressed && this.isOpen) {
				this.close();
			}
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		private _removeEventListeners(): void {
			this.featureElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventBodyClick
			);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _setA11YProperties(): void {
			Helper.Dom.Attribute.Set(this.featureElem, Constants.A11YAttributes.Aria.Hidden, (!this.isOpen).toString());

			Helper.Dom.Attribute.Set(
				this.featureElem,
				Constants.A11YAttributes.TabIndex,
				this.isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this.isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _setCSSClasses(): void {
			Helper.Dom.Styles.AddClass(this.featureElem, Enum.CssClasses.Pattern);
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		private _setCallbacks(): void {
			this._eventBodyClick = this._bodyClickCallback.bind(this);
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
		}

		/**
		 * Method to add event listeners
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		private _setEventListeners(isBuild = false): void {
			if (isBuild) {
				this._onToggleEvent = function dispatchCustomEvent(isOpen, balloonElem) {
					const _customEvent = new CustomEvent(GlobalEnum.CustomEvent.BalloonOnToggle, {
						detail: { isOpen: isOpen, balloonElem: balloonElem },
					});
					document.dispatchEvent(_customEvent);
				};
				window[OSFramework.OSUI.GlobalEnum.CustomEvent.BalloonOnToggle] =
					OSFramework.OSUI.GlobalEnum.CustomEvent.BalloonOnToggle;
			}

			this.featureElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventBodyClick
			);
		}

		// Method to toggle the open/close the Balloon
		private _toggleBalloon(isOpen: boolean): void {
			// Toggle class
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.featureElem, Enum.CssClasses.IsOpen);
			} else {
				Helper.Dom.Styles.RemoveClass(this.featureElem, Enum.CssClasses.IsOpen);
			}

			// Update property
			this.isOpen = isOpen;

			// Update listeners and A11y properties
			if (isOpen) {
				this._setEventListeners();
			} else {
				this._removeEventListeners();
			}

			this._setA11YProperties();

			// Update listeners and A11y properties
			if (isOpen) {
				this.setFloatingUIBehaviour();
			} else {
				this._floatingUIInstance.close();
			}

			// Handle focus trap logic
			if (isOpen) {
				this._focusableActiveElement = document.activeElement as HTMLElement;
				this._focusTrapInstance.enableForA11y();
				// Focus on element when pattern is open
				this.featureElem.focus();
			} else {
				this._focusTrapInstance.disableForA11y();

				// Focus on last element clicked. Async to avoid conflict with closing animation
				Helper.AsyncInvocation(() => {
					this.featureElem.blur();
					this._focusableActiveElement.focus();
				});
			}

			this._onToggleEvent(this.isOpen, this.featureElem);
		}

		public build(): void {
			this._setCSSClasses();
			this._setCallbacks();
			this._setEventListeners(true);
			this.setFloatingUIBehaviour();
			this._handleFocusTrap();
			this._setA11YProperties();
			this.setBalloonShape();
		}

		public close(): void {
			if (this.isOpen) {
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
			super.dispose();
		}

		public open(): void {
			if (this.isOpen === false) {
				this._toggleBalloon(true);
			}
		}

		// Method to handle the Shape config css variable
		public setBalloonShape(shape?: GlobalEnum.ShapeTypes): void {
			if (shape !== undefined) {
				this.featureOptions.shape = shape;
			}

			Helper.Dom.Styles.SetStyleAttribute(
				this.featureElem,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + this.featureOptions.shape + ')'
			);
		}

		public setFloatingUIBehaviour(isUpdate?: boolean): void {
			if (isUpdate || this._floatingUIInstance === undefined) {
				this.setFloatingUIOptions();

				if (isUpdate && this._floatingUIInstance !== undefined) {
					this._floatingUIInstance.update(this._floatingUIOptions);
				}

				this._floatingUIInstance = new Providers.OSUI.Utils.FloatingUI(this._floatingUIOptions);
			} else {
				this._floatingUIInstance.build();
			}
		}

		public setFloatingUIOptions(): void {
			this._floatingUIOptions = {
				autoPlacement: this.featureOptions.position === GlobalEnum.FloatingPosition.Auto,
				anchorElem: this.featureOptions.anchorElem,
				autoPlacementOptions: {
					alignment: this.featureOptions.alignment,
					allowedPlacements: this.featureOptions.allowedPlacements,
				},
				floatingElem: this.featureElem,
				position: this.featureOptions.position,
				useShift: true,
				updatePosition: true,
			};
		}

		public updateFloatingUIOptions(floatingUIOptions?: Providers.OSUI.Utils.FloatingUIOptions): void {
			if (floatingUIOptions !== undefined) {
				this._floatingUIOptions = floatingUIOptions;
			}

			this.setFloatingUIBehaviour(true);
		}

		public updatePositionOption(position: GlobalEnum.FloatingPosition): void {
			this.featureOptions.position = position;
			this.setFloatingUIBehaviour(true);
		}
	}
}
