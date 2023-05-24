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
		// Store the Balloon Element
		private _balloonElem: HTMLElement;
		// Store the Balloon Class instance
		private _balloonFeature: Feature.Balloon.IBalloon;
		// Store the Event Callbacks
		private _eventBalloonOnToggle: GlobalCallbacks.Generic;
		private _eventOnClick: GlobalCallbacks.Generic;
		// Store the platform events
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;
		// Store the element that triggers the balloon
		private _triggerElem: HTMLElement;
		// Store the Balloon options to pass to the Balloon Class
		public balloonOptions: Feature.Balloon.BalloonOptions;
		// Store the isOpen ststus
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
				this.open();
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
				Helper.A11Y.AriaHasPopupTrue(this.selfElement);
				//Helper.A11Y.AriaControls(this._triggerElem, this.balloonElem.widgetId);
			}

			Helper.A11Y.AriaExpanded(this.selfElement, this.isOpen.toString());
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
		}

		/**
		 * Method to set the event listeners
		 *
		 * @protected
		 * @memberof OverflowMenu
		 */
		protected setEventListeners(): void {
			this._triggerElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);

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
		 * Method to build the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this._setBalloonFeature();
			this.setCallbacks();
			this.setA11YProperties();
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
		 * Method to destroy the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public dispose(): void {
			this._balloonFeature.dispose();
			this.removeEventListeners();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		/**
		 * Method to open the Pattern
		 *
		 * @memberof OverflowMenu
		 */
		public open(): void {
			if (this._balloonFeature.isOpen === false) {
				this._balloonFeature.open();
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
				};
			}
		}
	}
}
