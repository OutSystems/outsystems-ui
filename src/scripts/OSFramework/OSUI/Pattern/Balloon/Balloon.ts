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
		public anchorElem: HTMLElement;

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

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setHtmlElements(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
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
			this.unsetCallbacks();

			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			//
		}
	}
}
