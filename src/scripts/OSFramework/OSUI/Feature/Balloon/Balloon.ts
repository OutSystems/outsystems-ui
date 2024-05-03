// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	// Type for the Balllon Feature options
	export type BalloonOptions = {
		alignment: GlobalEnum.FloatingAlignment;
		allowedPlacements?: Array<GlobalEnum.FloatingPosition>;
		anchorElem: HTMLElement;
		arrowElem?: HTMLElement;
		focusOptions?: FocusOptions;
		position: GlobalEnum.FloatingPosition | GlobalEnum.Position;
		shape: GlobalEnum.ShapeTypes;
		useTriggerWidth?: boolean;
	};

	// Type for the Focus options
	export type FocusOptions = {
		elemToFocusOnOpen?: HTMLElement;
		focusTrapParams?: Behaviors.FocusTrapParams;
		useFocus: boolean;
	};

	/**
	 * Class for the Balloon Feature
	 *
	 * @export
	 * @class Balloon
	 * @extends {AbstractFeature<PT, BalloonOptions>}
	 * @implements {IBalloon}
	 * @template PT
	 */
	export class Balloon<PT> extends AbstractFeature<PT, BalloonOptions> implements IBalloon {
		// Store the current focused element's index
		private _currentFocusedElementIndex: number;
		// Store the listener callbacks
		private _eventBodyClick: GlobalCallbacks.Generic;
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// On WindowResize Event
		private _eventOnWindowResize: GlobalCallbacks.Generic;
		// Store the Floating Util instance
		private _floatingInstance: Utils.FloatingPosition.FloatingPosition;
		// Store the Floating Util options
		private _floatingOptions: Utils.FloatingPosition.FloatingPositionConfig;
		// Store focus manager instance
		private _focusManagerInstance: Behaviors.FocusManager;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Store the focusable elements inside the balloon
		private _focusableBalloonElements: NodeListOf<Element>;
		// Flag used to deal with onBodyClick and open api concurrency methods!
		private _isOpenedByApi = false;
		// Store the onTogle custom event
		private _onToggleEvent: GlobalCallbacks.Generic;
		// Store if the pattern is open
		public isOpen = false;

		constructor(featurePattern: PT, featureElem: HTMLElement, options: BalloonOptions) {
			super(featurePattern, featureElem, options);
			this.build();
		}

		// Method to handle the body click callback, that closes the Balloon
		private _bodyClickCallback(_args: string, e: MouseEvent): void {
			const _eventTarget = e.target;

			if (
				_eventTarget === this.featureOptions?.anchorElem ||
				this._isOpenedByApi ||
				this.featureElem.contains(_eventTarget as HTMLElement)
			) {
				return;
			}

			if (this.isOpen) {
				this._toggleBalloon(false, true);
				e.stopPropagation();
			}
		}

		// Add Focus Trap to the Pattern
		private _handleFocusBehavior(): void {
			const opts = {
				focusTargetElement:
					this.featureOptions.focusOptions.focusTrapParams?.focusTargetElement === undefined
						? this._floatingOptions.AnchorElem.parentElement
						: this.featureOptions.focusOptions.focusTrapParams.focusTargetElement,
				focusBottomCallback: this.featureOptions.focusOptions.focusTrapParams?.focusBottomCallback,
				focusTopCallback: this.featureOptions.focusOptions.focusTrapParams?.focusTopCallback,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);

			this._focusManagerInstance = new Behaviors.FocusManager();
		}

		// Manage the focus of the elements inside the Balloon
		private _manageFocusInsideBalloon(
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		) {
			if (this.featureOptions.focusOptions.elemToFocusOnOpen === undefined) {
				if (this._focusableBalloonElements.length === 0 || arrowKeyPressed === undefined) {
					this._currentFocusedElementIndex = undefined;
				}
				// When ArrowDown is pressed
				else if (arrowKeyPressed === GlobalEnum.Keycodes.ArrowDown) {
					// If the _currentFocusedElementIndex is undefined or is the last one
					// Then move the focus to the first focusable element
					if (
						this._currentFocusedElementIndex === undefined ||
						this._currentFocusedElementIndex >= this._focusableBalloonElements.length - 1
					)
						this._currentFocusedElementIndex = 0;
					// Otherwise, move the focus to the next focusable element
					else this._currentFocusedElementIndex = this._currentFocusedElementIndex + 1;
				}
				// When ArrowUp is pressed
				else if (arrowKeyPressed === GlobalEnum.Keycodes.ArrowUp) {
					// If the _currentFocusedElementIndex is undefined or is the first one
					// Then move the focus to the last focusable element
					if (this._currentFocusedElementIndex === undefined || this._currentFocusedElementIndex === 0)
						this._currentFocusedElementIndex = this._focusableBalloonElements.length - 1;
					// Otherwise, move the focus to the previous focusable element
					else this._currentFocusedElementIndex = this._currentFocusedElementIndex - 1;
				}

				// If the _currentFocusedElementIndex is undefined, focus on the balloon wrapper
				if (this._currentFocusedElementIndex === undefined) {
					OSUI.Helper.AsyncInvocation(() => {
						this.featureElem.focus();
					});
					// Otherwise, focus on the element corresponding ot the _currentFocusedElementIndex
				} else {
					OSUI.Helper.AsyncInvocation(() => {
						(this._focusableBalloonElements[this._currentFocusedElementIndex] as HTMLElement).focus();
					});
				}
			} else {
				this.featureOptions.focusOptions.elemToFocusOnOpen.focus();
			}
		}

		// Call methods to open or close, based on e.key and behaviour applied
		private _onKeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const isArrowDownPressed = e.key === GlobalEnum.Keycodes.ArrowDown;
			const isArrowUpPressed = e.key === GlobalEnum.Keycodes.ArrowUp;

			if (this.isOpen) {
				// Close the Balloon when pressing Esc
				if (isEscapedPressed) {
					this.close();
					e.stopPropagation();
					// Move the focus between the balloon's focusable elements when pressing ArrowDown or ArrowUp
				} else if (isArrowDownPressed || isArrowUpPressed) {
					this._manageFocusInsideBalloon(e.key);
					e.preventDefault(); // Prevent scroll
				}
			}

			e.stopPropagation();
		}

		// Manage the behaviour when there is a window resize!
		private _onWindowResize(): void {
			// If there is a horizontal resize and the Balloon is open, close it!
			if (this.isOpen) {
				this.close();
			}
		}

		// Method to remove the event listeners
		private _removeEventListeners(): void {
			this.featureElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventBodyClick
			);

			if (this.featureOptions.useTriggerWidth) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
					Event.DOMEvents.Listeners.Type.WindowResize,
					this._eventOnWindowResize
				);
			}
		}

		// Add the Accessibility Attributes values
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _setA11YProperties(): void {
			Helper.Dom.Attribute.Set(this.featureElem, Constants.A11YAttributes.Aria.Hidden, (!this.isOpen).toString());

			if (this.featureOptions.focusOptions.useFocus !== false) {
				// Will handle the tabindex value of the elements inside pattern
				Helper.A11Y.SetElementsTabIndex(this.isOpen, this._focusTrapInstance.focusableElements);

				Helper.Dom.Attribute.Set(
					this.featureElem,
					Constants.A11YAttributes.TabIndex,
					this.isOpen
						? Constants.A11YAttributes.States.TabIndexShow
						: Constants.A11YAttributes.States.TabIndexHidden
				);

				Helper.Dom.Attribute.Set(
					this._floatingOptions.AnchorElem,
					Constants.A11YAttributes.TabIndex,
					this.isOpen
						? Constants.A11YAttributes.States.TabIndexHidden
						: Constants.A11YAttributes.States.TabIndexShow
				);
			}
		}

		// Method to set the ballon width, based on the useTriggerWidth option
		private _setBalloonWidth(): void {
			const _balloonWidth = this.featureOptions.useTriggerWidth
				? this.featureOptions.anchorElem.offsetWidth + GlobalEnum.Units.Pixel
				: GlobalEnum.CssProperties.MaxContent;

			Helper.Dom.Styles.SetStyleAttribute(this.featureElem, Enum.CssCustomProperties.Width, _balloonWidth);
		}

		// Set the callbacks
		private _setCallbacks(): void {
			this._eventBodyClick = this._bodyClickCallback.bind(this);
			this._eventOnKeypress = this._onKeypressCallback.bind(this);
			this._eventOnWindowResize = this._onWindowResize.bind(this);

			// Set custom Balloon event
			this._onToggleEvent = function dispatchCustomEvent(isOpen, balloonElem) {
				const _customEvent = new CustomEvent(GlobalEnum.CustomEvent.BalloonOnToggle, {
					detail: { isOpen: isOpen, balloonElem: balloonElem },
				});
				document.dispatchEvent(_customEvent);
			};
		}

		//  Method to add event listeners
		private _setEventListeners(): void {
			if (this.featureOptions.focusOptions.useFocus !== false) {
				this.featureElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			}

			if (this.isOpen) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BodyOnClick,
					this._eventBodyClick
				);
			}

			if (this.featureOptions.useTriggerWidth) {
				// Add the window resize callback that will be used to close the balloon and avoid width differences!
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.WindowResize,
					this._eventOnWindowResize
				);
			}
		}

		// Method to toggle the open/close the Balloon
		private _toggleBalloon(
			isOpen: boolean,
			isBodyClick = false,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void {
			// Update property
			this.isOpen = isOpen;

			// Toggle class
			if (this.isOpen) {
				Helper.Dom.Styles.AddClass(this.featureElem, Enum.CssClasses.IsOpen);

				if (this.featureOptions.useTriggerWidth) {
					this._setBalloonWidth();
				}

				// Set Floating Util
				this.setFloatingBehaviour();
				// Add event listeners. This is async to prevent unnecessary calls when clicking on triggers
				Helper.AsyncInvocation(this._setEventListeners.bind(this));
			} else {
				Helper.Dom.Styles.RemoveClass(this.featureElem, Enum.CssClasses.IsOpen);
				// Remove Floating Util
				this._floatingInstance.unsetFloatingPosition();
				// remove event listeners
				this._removeEventListeners();
			}

			// Update A11y attributes
			this._setA11YProperties();

			if (this.isOpen) {
				if (this.featureOptions.focusOptions.useFocus !== false) {
					// Handle focus trap logic
					this._focusManagerInstance.storeLastFocusedElement();
					this._focusTrapInstance.enableForA11y();
				}

				if (this.featureOptions.focusOptions.useFocus !== false) {
					// Store the focusable elements inside the Balloon
					this._focusableBalloonElements = this.featureElem.querySelectorAll(Constants.FocusableElems);
					// Manage the focus when opening the balloon
					this._manageFocusInsideBalloon(arrowKeyPressed);
				}
			} else if (this.featureOptions.focusOptions.useFocus !== false) {
				// Handle focus trap logic
				this._focusTrapInstance.disableForA11y();
				// Focus on last element clicked. Async to avoid conflict with closing animation
				Helper.AsyncInvocation(() => {
					this.featureElem.blur();
					if (isBodyClick === false) {
						this._focusManagerInstance.setFocusToStoredElement();
					}
				});

				// Unset focus attributes
				this._focusableBalloonElements = undefined;
				this._currentFocusedElementIndex = undefined;
			}

			// Trigger the Custom Event BalloonOnToggle
			this._onToggleEvent(this.isOpen, this.featureElem);

			// Delay the _isOpenedByApi assignement in order to deal with clickOnBody() and open() api concurrency!
			Helper.AsyncInvocation(() => {
				this._isOpenedByApi = false;
			});
		}

		// Method to unset the callbaks
		private _unsetCallbacks(): void {
			this._eventBodyClick = undefined;
			this._eventOnKeypress = undefined;
			this._onToggleEvent = undefined;
			this._eventOnWindowResize = undefined;
			window[OSFramework.OSUI.GlobalEnum.CustomEvent.BalloonOnToggle] = undefined;
		}

		/**
		 * Method to build the Feature
		 *
		 * @memberof Balloon
		 */
		public build(): void {
			this._setCallbacks();
			this._setEventListeners();
			this.setFloatingConfigs();

			if (this.featureOptions.focusOptions.useFocus !== false) {
				this._handleFocusBehavior();
			}

			this._setA11YProperties();
			this._setBalloonWidth();
			this.setBalloonShape();
		}

		/**
		 * Method to close the Balloon
		 *
		 * @memberof Balloon
		 */
		public close(): void {
			if (this.isOpen) {
				this._toggleBalloon(false);
			}
		}

		/**
		 * Destroy the Balloon.
		 *
		 * @memberof Balloon
		 */
		public dispose(): void {
			this._floatingInstance?.dispose();
			this._removeEventListeners();
			this._unsetCallbacks();
			super.dispose();
		}

		/**
		 * Method to open the Balloon
		 *
		 * @memberof Balloon
		 */
		public open(
			isOpenedByApi: boolean,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void {
			if (this.isOpen === false) {
				this._isOpenedByApi = isOpenedByApi;
				this._toggleBalloon(true, false, arrowKeyPressed);
			}
		}

		/**
		 * Method to handle the Shape config css variable
		 *
		 * @param {GlobalEnum.ShapeTypes} [shape]
		 * @memberof Balloon
		 */
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

		/**
		 * Method to set the Floating Util
		 *
		 * @param {boolean} [isUpdate]
		 * @memberof Balloon
		 */
		public setFloatingBehaviour(isUpdate?: boolean): void {
			if (isUpdate || this._floatingInstance === undefined) {
				this.setFloatingConfigs();

				if (isUpdate && this._floatingInstance !== undefined) {
					this._floatingInstance.update(this._floatingOptions);
				} else {
					this._floatingInstance = new Utils.FloatingPosition.Factory.NewFloatingPosition(
						this._floatingOptions,
						Utils.FloatingPosition.Enum.Provider.FloatingUI
					);
				}
			} else {
				this._floatingInstance.build();
			}
		}

		/**
		 * Method to set the Floating configs
		 *
		 * @memberof Balloon
		 */
		public setFloatingConfigs(): void {
			this._floatingOptions = {
				AutoPlacement: this.featureOptions.position === GlobalEnum.FloatingPosition.Auto,
				AnchorElem: this.featureOptions.anchorElem,
				ArrowElem: this.featureOptions.arrowElem,
				AutoPlacementOptions: {
					alignment: this.featureOptions.alignment,
					allowedPlacements: this.featureOptions.allowedPlacements,
				},
				FloatingElem: this.featureElem,
				Position: this.featureOptions.position,
				UpdatePosition: true,
			};
		}

		/**
		 * Method to update the FloatingUI options
		 *
		 * @param {Providers.OSUI.Utils.FloatingUIOptions} [floatingConfigs]
		 * @memberof Balloon
		 */
		public updateFloatingConfigs(floatingConfigs?: Utils.FloatingPosition.FloatingPositionConfig): void {
			if (floatingConfigs !== undefined) {
				this._floatingOptions = floatingConfigs;
			}

			this.setFloatingBehaviour(true);
		}

		/**
		 * Method to update the Position config on the FloatingUI
		 *
		 * @param {GlobalEnum.FloatingPosition} position
		 * @memberof Balloon
		 */
		public updatePositionOption(position: GlobalEnum.FloatingPosition): void {
			this.featureOptions.position = position;
			this.setFloatingBehaviour(true);
		}
	}
}
