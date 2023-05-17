// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.InlineSvg {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class InlineSvg extends AbstractPattern<InlineSvgConfig> implements IInlineSvg {
		// Store the parent element
		private _parentSelf: HTMLElement;
		// Store the platform events
		private _platformEventOnInitialize: Callbacks.OSInitializedEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new InlineSvgConfig(configs));
		}

		private _setSvgCode(): void {
			if (this.configs.SVGCode !== '' && !Helper.SVG.IsValid(this.configs.SVGCode)) {
				throw new Error('Please provide a valid SVGCode.');
			}
			this.selfElement.innerHTML = this.configs.SVGCode;
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
		 * Set the callbacks that will be assigned to the pattern
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);

			Helper.AsyncInvocation(this._platformEventOnInitialize, this.widgetId);
		}

		/**
		 * Set the callbacks that will be assigned to the pattern
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this._platformEventOnInitialize = undefined;
		}

		public build(): void {
			super.build();

			this._setSvgCode();

			this.setHtmlElements();

			this.finishBuild();
		}

		/**
		 * Update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.SVGCode:
						this._setSvgCode();
						break;
					case GlobalEnum.CommonPatternsProperties.ExtendedClass:
						Helper.Dom.Styles.ExtendedClass(
							this.selfElement,
							this.configs.ExtendedClass,
							propertyValue as string
						);
						break;
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
				// Remove Callbacks
				// this.unsetCallbacks();

				// Remove unused HTML elements
				this.unsetHtmlElements();

				//Destroying the base of pattern
				super.dispose();
			}
		}

		/**
		 * Method used to register the callback
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.InlineSvg.InlineSvg
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.InlineSvg.Enum.Events.OnInitialize:
					if (this._platformEventOnInitialize === undefined) {
						this._platformEventOnInitialize = callback;
					}
					break;

				default:
					throw new Error(
						`${ErrorCodes.InlineSvg.FailRegisterCallback}:	The given '${eventName}' event name is not defined.`
					);
			}
		}
	}
}
