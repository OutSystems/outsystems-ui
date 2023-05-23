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
	export class Balloon extends AbstractFloatable<BalloonConfig> implements IBalloon {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIInstance: Providers.OSUI.Utils.FloatingUI;
		public anchorElem: HTMLElement;
		public floatingOptions: Providers.OSUI.Utils.FloatingUIOptions;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BalloonConfig(configs));
			this.openCSSClass = Enum.CssClasses.IsOpen;
		}

		// Method to handle the Shape config css variable
		private _handleShape(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + this.configs.Shape + ')'
			);
		}

		protected bodyClickCallback(_args: string, e: MouseEvent): void {
			if (e.target === this.anchorElem) {
				return;
			}
			super.bodyClickCallback(_args, e);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setA11YProperties(): void {
			if (!this.isBuilt) {
				//Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.Role.Complementary, true);
			}

			super.setA11YProperties();
		}

		protected setFloatingBehaviour(isUpdate = false): void {
			if (this._floatingUIInstance === undefined || isUpdate) {
				this.floatingOptions = {
					autoPlacement: this.configs.Position === GlobalEnum.FloatingPosition.Auto,
					anchorElem: this.anchorElem,
					autoPlacementOptions: {
						placement: this.configs.Alignment,
						allowedPlacements: this.configs.AllowedPlacements,
					},
					floatingElem: this.selfElement,
					position: this.configs.Position,
					useShift: true,
					updatePosition: true,
				};

				if (isUpdate && this._floatingUIInstance !== undefined) {
					this._floatingUIInstance.update(this.floatingOptions);
				}

				this._floatingUIInstance = new Providers.OSUI.Utils.FloatingUI(this.floatingOptions);
			} else {
				this._floatingUIInstance.build();
			}
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected setHtmlElements(): void {
			super.setHtmlElements();
			this.anchorElem = document.getElementById(this.configs.AnchorId);
		}

		// Method to toggle the open/close the Balloon
		protected togglePattern(isOpen: boolean): void {
			super.togglePattern(isOpen);

			// Update listeners and A11y properties
			if (isOpen) {
				this.setFloatingBehaviour();
			} else {
				this._floatingUIInstance.close();
			}
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetCallbacks(): void {
			super.unsetCallbacks();
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected unsetHtmlElements(): void {
			super.unsetHtmlElements();
			this.anchorElem = undefined;
		}

		public build(): void {
			super.build();
			this._handleShape();
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
				switch (propertyName) {
					case Enum.Properties.AnchorId:
						this.setHtmlElements();
						this.setFloatingBehaviour();
						break;
					case Enum.Properties.BalloonPosition:
						this.setFloatingBehaviour();
						break;
					case Enum.Properties.BalloonShape:
						this._handleShape();
				}
			}
		}

		/**
		 * Destroy the Balloon.
		 *
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		public dispose(): void {
			this._floatingUIInstance.dispose();

			super.dispose();
		}
	}
}
