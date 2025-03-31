// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.InlineSvg {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class InlineSvg extends AbstractPattern<InlineSvgConfig> implements IInlineSvg {
		/**
		 * Creates an instance of InlineSvg.
		 *
		 * @param {string} uniqueId
		 * @param {JSON} configs
		 * @memberof InlineSvg
		 */
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new InlineSvgConfig(configs));
		}

		// Method that will set the given SVG code into the pattern container.
		private _setSvgCode(): void {
			if (this.configs.SVGCode !== '' && !Helper.SVG.IsValid(this.configs.SVGCode)) {
				this.selfElement.innerHTML = '';
				console.error('Please provide a valid SVGCode.');
			} else {
				this.selfElement.innerHTML = this.configs.SVGCode;
			}
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Unset the callbacks that will be assigned to the pattern.
		 *
		 * @protected
		 * @memberof InlineSvg
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to build the InlineSVG
		 *
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		public build(): void {
			super.build();

			this._setSvgCode();

			this.finishBuild();
		}

		/**
		 * Update value when a parameters changed occurs.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// If SVG code has changed, update it
				if (propertyName === Enum.Properties.SVGCode) {
					this._setSvgCode();
				}
			}
		}

		/**
		 * Destroy the InlineSvg
		 *
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		public dispose(): void {
			if (this.isBuilt) {
				//Destroying the base of pattern
				super.dispose();
			}
		}
	}
}
