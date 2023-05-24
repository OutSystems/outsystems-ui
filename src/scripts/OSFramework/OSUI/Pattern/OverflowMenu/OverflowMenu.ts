// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	export class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
		private _balloonElem: HTMLElement;
		private _balloonFeature: Feature.Balloon.IBalloon;
		private _eventBalloonOnToggle: GlobalCallbacks.Generic;
		private _eventOnClick: GlobalCallbacks.Generic;
		// Store the platform events
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;
		private _triggerElem: HTMLElement;
		public balloonOptions: Feature.Balloon.BalloonOptions;
		public isOpen = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OverflowMenuConfig(configs));
		}

		private _balloonOnToggleCallback(_args: string, e: CustomEvent): void {
			if (e.detail.balloonElem === this._balloonElem) {
				this.togglePattern(e.detail.isOpen);
			}
		}

		private _onClickCallback(): void {
			if (this._balloonFeature.isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		private _setBalloonFeature(): void {
			this.setBalloonOptions();

			this._balloonFeature = new OSFramework.OSUI.Feature.Balloon.Balloon<IOverflowMenu>(
				this,
				this._balloonElem,
				this.balloonOptions
			);
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this.isOpen);
		}

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
		 * Removes the listeners that were added in the code and unsets the callbacks.
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
			this._triggerElem = undefined;
			this._balloonFeature = undefined;
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this._setBalloonFeature();
			this.setCallbacks();
			this.setA11YProperties();
			this.setEventListeners();
			this.finishBuild();
		}

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

		public close(): void {
			if (this._balloonFeature.isOpen) {
				this._balloonFeature.close();
			}
		}

		public dispose(): void {
			this._balloonFeature.dispose();
			this.removeEventListeners();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		public open(): void {
			if (this._balloonFeature.isOpen === false) {
				this._balloonFeature.open();
			}
		}

		/**
		 * Set callbacks for the pattern
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

		public togglePattern(isOpen: boolean): void {
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Open);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.Open);
			}

			this.isOpen = isOpen;

			this.setA11YProperties();

			this._triggerOnToggleEvent();
		}
	}
}
