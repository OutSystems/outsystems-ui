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
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUICallback: GlobalCallbacks.Generic;
		private _platformEventInitialized: GlobalCallbacks.Generic;
		private _platformEventOnToggle: GlobalCallbacks.Generic;
		public anchorElem: HTMLElement;
		public floatingOptions: Providers.OSUI.Utils.FloatingUIOptions;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BalloonConfig(configs));
		}

		/**
		 * This method has no implementation on this pattern context!
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setCallbacks(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		protected setFloatingBehaviour(): void {
			this.floatingOptions = {
				autoPlacement: true,
				anchorElem: this.anchorElem,
				floatingElem: this.selfElement,
				position: this.configs.Position,
				useShift: true,
				updatePosition: true,
			};

			this._floatingUICallback = Providers.OSUI.Utils.FloatingUI.setFloatingPosition(
				this.floatingOptions
			) as GlobalCallbacks.Generic;
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setHtmlElements(): void {
			this.anchorElem = document.getElementById(this.configs.AnchorId);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetCallbacks(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetHtmlElements(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setFloatingBehaviour();
			this.finishBuild();
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
				//
			}
		}

		public close(): void {
			//
		}

		/**
		 * Destroy the Balloon.
		 *
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public dispose(): void {
			this._floatingUICallback();

			this.unsetCallbacks();

			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			//
		}

		/**
		 * Set callbacks for the onToggle event
		 *
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */

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
