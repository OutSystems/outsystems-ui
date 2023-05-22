// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	export class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
		private _platformEventInitialized: GlobalCallbacks.Generic;
		public balloonElem: Balloon.IBalloon;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OverflowMenuConfig(configs));
		}

		// Method that triggers the Intialized event
		private _triggerInitializedEvent(): void {
			Helper.AsyncInvocation(this._platformEventInitialized, this.widgetId);
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
			//
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setHtmlElements(): void {
			//this.balloonElem = document.getElementById(this.configs.AnchorId);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetCallbacks(): void {
			this._platformEventInitialized = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetHtmlElements(): void {
			this.balloonElem = undefined;
		}

		public build(): void {
			super.build();
			super.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		public close(): void {
			this.balloonElem.close();
		}

		public dispose(): void {
			super.dispose();
		}

		public open(): void {
			this.balloonElem.open();
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
