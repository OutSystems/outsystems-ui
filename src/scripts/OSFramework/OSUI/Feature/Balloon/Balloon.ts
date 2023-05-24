// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	export type BalloonOptions = {
		alignment: string;
		allowedPlacements: Array<GlobalEnum.FloatingPosition>;
		anchorElem: HTMLElement;
		balloonElem: HTMLElement;
		position: GlobalEnum.FloatingPosition;
		shape: GlobalEnum.ShapeTypes;
	};

	export class Balloon implements IBalloon {
		// Listener callbacks
		private _eventBodyClick: GlobalCallbacks.Generic;
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		private _focusableActiveElement: HTMLElement;
		// WidgetId element
		private _parentSelf: HTMLElement;
		private _platformEventOnToggle: GlobalCallbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		protected openCSSClass: string;
		// Store if the pattern is open
		public isOpen = false;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIInstance: Providers.OSUI.Utils.FloatingUI;
		public anchorElem: HTMLElement;
		public floatingOptions: Providers.OSUI.Utils.FloatingUIOptions;
		public selfElement: HTMLElement;
		public balloonOptions: BalloonOptions;

		constructor(options: BalloonOptions) {
			this.balloonOptions = options;
			this.openCSSClass = Enum.CssClasses.IsOpen;
			this.selfElement = this.balloonOptions.balloonElem;

			this.build();
		}

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this.floatingOptions.anchorElem.parentElement,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		protected bodyClickCallback(_args: string, e: MouseEvent): void {
			if (e.target === this.anchorElem) {
				return;
			}
			this.close();
			e.stopPropagation();
		}

		// Call methods to open or close, based on e.key and behaviour applied
		protected onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Balloon when pressing Esc
			if (isEscapedPressed && this.isOpen) {
				this.close();
			}
		}

		// Method to handle the Shape config css variable
		private _handleShape(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + this.balloonOptions.shape + ')'
			);
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected removeEventListeners(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
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
		protected setA11YProperties(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.Aria.Hidden, (!this.isOpen).toString());

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.TabIndex,
				this.isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this.isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setCallbacks(): void {
			this._eventBodyClick = this.bodyClickCallback.bind(this);
			this._eventOnKeypress = this.onkeypressCallback.bind(this);
		}

		/**
		 * Method to add event listeners
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setEventListeners(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventBodyClick
			);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setHtmlElements(): void {
			//this.anchorElem = document.getElementById(this.configs.AnchorId);
		}

		protected setFloatingBehaviour(isUpdate = false): void {
			if (this._floatingUIInstance === undefined || isUpdate) {
				this.floatingOptions = {
					autoPlacement: this.balloonOptions.position === GlobalEnum.FloatingPosition.Auto,
					anchorElem: this.balloonOptions.anchorElem,
					autoPlacementOptions: {
						placement: this.balloonOptions.alignment,
						allowedPlacements: this.balloonOptions.allowedPlacements,
					},
					floatingElem: this.selfElement,
					position: this.balloonOptions.position,
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

		// Method to toggle the open/close the Balloon
		protected togglePattern(isOpen: boolean): void {
			// Toggle class
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, this.openCSSClass);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, this.openCSSClass);
			}

			// Update property
			this.isOpen = isOpen;

			// Update listeners and A11y properties
			if (isOpen) {
				this.setEventListeners();
			} else {
				this.removeEventListeners();
			}

			this.setA11YProperties();

			// Update listeners and A11y properties
			if (isOpen) {
				this.setFloatingBehaviour();
			} else {
				this._floatingUIInstance.close();
			}

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
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetHtmlElements(): void {
			this.anchorElem = undefined;
		}

		public build(): void {
			this.setHtmlElements();
			this.setCallbacks();
			this.setEventListeners();
			this.setFloatingBehaviour();
			this._handleFocusTrap();
			this.setA11YProperties();
			this._handleShape();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
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

		public close(): void {
			if (this.isOpen) {
				this.togglePattern(false);
			}
		}

		/**
		 * Destroy the Balloon.
		 *
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public dispose(): void {
			this._floatingUIInstance.dispose();
		}

		public open(): void {
			if (this.isOpen === false) {
				this.togglePattern(true);
			}
		}
	}
}
