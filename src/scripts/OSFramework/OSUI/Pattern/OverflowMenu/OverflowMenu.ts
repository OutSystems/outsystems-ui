// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Class for the OverflowMenu Pattern
	 *
	 * @export
	 * @class OverflowMenu
	 * @extends {AbstractPattern<OverflowMenuConfig>}
	 * @implements {IOverflowMenu}
	 */
	export class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
		// Store the aria-label text used on the Trigger Element
		private _ariaLabelTrigger: string;
		// Store the Balloon Element
		private _balloonElem: HTMLElement;
		// Store the Balloon Class instance
		private _balloonFeature: Feature.Balloon.IBalloon;
		// Store the Event Callbacks
		private _eventBalloonOnToggle: GlobalCallbacks.Generic;
		private _eventOnClick: GlobalCallbacks.Generic;
		private _eventOnKeydown: GlobalCallbacks.Generic;
		// Flag used to set the enable/disable state
		private _isDisabled = false;
		// Flag used to deal with onBodyClick and open api concurrency methods!
		private _isOpenedByApi = false;
		// Store the platform events
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;
		// Store the element that triggers the balloon
		private _triggerElem: HTMLElement;

		// Store the Balloon options to pass to the Balloon Class
		public balloonOptions: Feature.Balloon.BalloonOptions;
		// Store the isOpen status
		public isOpen = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OverflowMenuConfig(configs));
		}

		// Method to handle the custom BalloonOnToggle callback
		private _balloonOnToggleCallback(_args: string, e: CustomEvent): void {
			// If the balloon closed is the one from this pattern, toggle the OverflowMenu
			if (e.detail.balloonElem === this._balloonElem) {
				this._togglePattern(e.detail.isOpen);
			}
		}

		// Method to handle the trigger click callback
		private _onClickCallback(): void {
			if (this._balloonFeature.isOpen) {
				this.close();
			} else {
				this._isOpenedByApi = false;
				this.open(this._isOpenedByApi);
			}
		}

		// Method to handle the trigger Keydown callback
		private _onKeydownCallback(event: KeyboardEvent): void {
			if (
				!this._balloonFeature.isOpen &&
				(event.key === GlobalEnum.Keycodes.ArrowDown || event.key === GlobalEnum.Keycodes.ArrowUp)
			) {
				this._isOpenedByApi = false;
				this.open(this._isOpenedByApi, event.key);
				event.preventDefault(); // Prevent scroll
			}
		}

		// Method to call the Balloon Class
		private _setBalloonFeature(): void {
			this.setBalloonOptions();

			this._balloonFeature = new OSFramework.OSUI.Feature.Balloon.Balloon<IOverflowMenu>(
				this,
				this._balloonElem,
				this.balloonOptions
			);
		}

		// Method to handle the Shape config css variable
		private _setOverflowMenuShape(shape?: GlobalEnum.ShapeTypes): void {
			if (shape !== undefined) {
				this.configs.Shape = shape;
			}

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.CssCustomProperties.Shape,
				`var(--border-radius-${this.configs.Shape})`
			);
		}

		// Method to toggle the Pattern
		private _togglePattern(isOpen: boolean): void {
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Open);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.Open);
			}

			this.isOpen = isOpen;

			this.setA11YProperties();

			this._triggerOnToggleEvent();
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this.isOpen);
		}

		/**
		 * Method that removes the event listeners
		 *
		 * @protected
		 * @memberof OverflowMenu
		 */
		protected removeEventListeners(): void {
			this._triggerElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._triggerElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeydown);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setA11YProperties(): void {
			if (this.isBuilt === false) {
				Helper.A11Y.AriaHasPopup(this._triggerElem, Constants.A11YAttributes.Aria.Haspopup.value.Menu);
				Helper.A11Y.AriaControls(this._triggerElem, this._balloonElem.id);
				Helper.A11Y.RoleMenu(this._balloonElem);
				this.setTriggerAriaLabel(Enum.AriaLabel.Trigger);
				Helper.Dom.Attribute.Set(this._triggerElem, Constants.FocusTrapIgnoreAttr, true);
			}

			Helper.A11Y.AriaExpanded(this._triggerElem, this.isOpen.toString());
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setCallbacks(): void {
			this._eventBalloonOnToggle = this._balloonOnToggleCallback.bind(this);
			this._eventOnClick = this._onClickCallback.bind(this);
			this._eventOnKeydown = this._onKeydownCallback.bind(this);
		}

		/**
		 * Method to set the event listeners
		 *
		 * @protected
		 * @memberof OverflowMenu
		 */
		protected setEventListeners(): void {
			this._triggerElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._triggerElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeydown);

			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.BalloonOnToggle,
				this._eventBalloonOnToggle
			);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setHtmlElements(): void {
			this._triggerElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Trigger);
			this._balloonElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Balloon);
		}

		/**
		 * Method to unset the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetCallbacks(): void {
			this._eventBalloonOnToggle = undefined;
			this._eventOnClick = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetHtmlElements(): void {
			this._balloonElem = undefined;
			this._triggerElem = undefined;
			this._balloonFeature = undefined;
		}

		/**
		 * Method to build the OverflowMenu
		 *
		 * @memberof OverflowMenu
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setA11YProperties();
			this._setBalloonFeature();
			this._setOverflowMenuShape();
			this.setCallbacks();
			this.setEventListeners();
			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OverflowMenu
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.Position:
						this._balloonFeature.updatePositionOption(propertyValue as GlobalEnum.FloatingPosition);
						break;
					case Enum.Properties.Shape:
						this._setOverflowMenuShape(propertyValue as GlobalEnum.ShapeTypes);
						this._balloonFeature.setBalloonShape(propertyValue as GlobalEnum.ShapeTypes);
						break;
				}
			}
		}

		/**
		 * Method to close the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public close(): void {
			if (this._balloonFeature.isOpen) {
				this._balloonFeature.close();
			}
		}

		/**
		 * Method to disable the pattern
		 *
		 * @memberof OverflowMenu
		 */
		public disable(): void {
			this._isDisabled = true;
			this.close();
			Helper.Dom.Attribute.Set(
				this._triggerElem,
				GlobalEnum.HTMLAttributes.Disabled,
				OSFramework.OSUI.Constants.EmptyString
			);
		}

		/**
		 * Method to destroy the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public dispose(): void {
			this._balloonFeature?.dispose();
			this.removeEventListeners();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		/**
		 * Method to enable the pattern
		 *
		 * @memberof OverflowMenu
		 */
		public enable(): void {
			this._isDisabled = false;
			Helper.Dom.Attribute.Remove(this._triggerElem, GlobalEnum.HTMLAttributes.Disabled);
		}

		/**
		 * Method to open the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public open(
			isOpenedByApi: boolean,
			keyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void {
			if (this._balloonFeature.isOpen === false && this._isDisabled === false) {
				this._isOpenedByApi = isOpenedByApi;
				this._balloonFeature.open(this._isOpenedByApi, keyPressed);
			}
		}

		/**
		 * Register the callbacks for the Pattern
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.OverflowMenu.Enum.Events.OnMenuToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					} else {
						console.warn(`The ${GlobalEnum.PatternName.OverflowMenu} already has the toggle callback set.`);
					}
					break;

				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to set the Balloon Feature options
		 *
		 * @param {Feature.Balloon.BalloonOptions} [balloonOptions]
		 * @memberof OverflowMenu
		 */
		public setBalloonOptions(balloonOptions?: Feature.Balloon.BalloonOptions): void {
			if (balloonOptions !== undefined) {
				this.balloonOptions = balloonOptions;
			} else {
				// Set focus options to pass to the Balloon feature
				const _focusOptions = {
					useFocus: true,
				};

				this.balloonOptions = {
					alignment: GlobalEnum.FloatingAlignment.Start,
					allowedPlacements: [
						GlobalEnum.FloatingPosition.BottomStart,
						GlobalEnum.FloatingPosition.BottomEnd,
						GlobalEnum.FloatingPosition.TopStart,
						GlobalEnum.FloatingPosition.TopEnd,
					],
					anchorElem: this._triggerElem,
					position: this.configs.Position,
					shape: this.configs.Shape,
					focusOptions: _focusOptions,
				};
			}
		}

		/**
		 * Method to set the aria-label text for the Trigger element
		 *
		 * @param {string} ariaLabelText
		 * @memberof OverflowMenu
		 */
		public setTriggerAriaLabel(ariaLabelText: string): void {
			if (ariaLabelText !== Constants.EmptyString) {
				this._ariaLabelTrigger = ariaLabelText;
				Helper.A11Y.AriaLabel(this._triggerElem, this._ariaLabelTrigger);
			}
		}
	}
}
