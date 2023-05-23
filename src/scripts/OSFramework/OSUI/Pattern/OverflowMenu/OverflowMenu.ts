// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	export class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
		private _eventOnClick: GlobalCallbacks.Generic;
		private _platformEventInitialized: GlobalCallbacks.Generic;
		private _triggerElem: HTMLElement;
		public balloonElem: Balloon.IBalloon;
		public isOpen = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OverflowMenuConfig(configs));
		}

		private _onClickCallback(): void {
			if (this.balloonElem.isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		// Method that triggers the Intialized event
		private _triggerInitializedEvent(): void {
			Helper.AsyncInvocation(this._platformEventInitialized, this.widgetId);
		}

		protected removeEventListeners(): void {
			this._triggerElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setA11YProperties(): void {
			//
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onClickCallback.bind(this);
		}

		protected setEventListeners(): void {
			this._triggerElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setHtmlElements(): void {
			this._triggerElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Trigger);
			this.balloonElem = OutSystems.OSUI.Patterns.BalloonAPI.GetBalloonById(this.configs.BalloonWidgetId);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetCallbacks(): void {
			this._eventOnClick = undefined;
			this._platformEventInitialized = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetHtmlElements(): void {
			this._triggerElem = undefined;
			this.balloonElem = undefined;
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this.setEventListeners();
			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		public close(): void {
			if (this.balloonElem.isOpen) {
				this.balloonElem.close();
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.Open);
				this.isOpen = false;
			}
		}

		public dispose(): void {
			this.removeEventListeners();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		public open(): void {
			if (this.balloonElem.isOpen === false) {
				this.balloonElem.open();
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Open);
				this.isOpen = true;
			}
		}

		/**
		 * Set callbacks for the pattern events
		 *
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @param {string} eventName
		 * @memberof OverflowMenu
		 */
		public registerCallback(callback: GlobalCallbacks.OSGeneric, eventName: string): void {
			switch (eventName) {
				case Enum.Events.Initialized:
					if (this._platformEventInitialized === undefined) {
						this._platformEventInitialized = callback;
					} else {
						console.warn(
							`The ${GlobalEnum.PatternName.OverflowMenu} already has the ${eventName} callback set.`
						);
					}
					break;
				case Enum.Events.OnMenuToggle:
					/* 					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					} else {
						console.warn(
							`The ${GlobalEnum.PatternName.OverflowMenu} already has the ${eventName} callback set.`
						);
					} */
					break;
			}
		}
	}
}
