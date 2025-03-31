/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Bar {
	export class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new ProgressBarConfig(configs));
			this.progressType = ProgressEnum.ProgressTypes.Bar;
		}

		// Set the default inline css variables
		private _setCssVariables(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Thickness,
				this.configs.Thickness + GlobalEnum.Units.Pixel
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Shape,
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this.configs.Shape)
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		// Update progress color based on value change
		private _updateProgressColor(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);
		}

		// Update progress shape based on value change
		private _updateShape(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Shape,
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this.configs.Shape)
			);
		}

		// Update progress thickness based on value change
		private _updateThickness(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Thickness,
				this.configs.Thickness + GlobalEnum.Units.Pixel
			);
		}

		// Update progress trail color based on value change
		private _updateTrailColor(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		/**
		 * Add the initial animation to the pattern if it's applicable
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this.configs.AnimateInitialProgress) {
				this.animateInitial();
			}

			// Update the progress value and the valuenow accessibility property
			this.updatedProgressValue();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected setA11YProperties(): void {
			if (this.contentElem.innerHTML) Helper.A11Y.AriaLabelledBy(this.selfElement, this.contentElem.id);
			else Helper.A11Y.AriaLabel(this.selfElement, ProgressEnum.AriaLabel.Progress);
		}

		/**
		 * Method to set callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected setCallbacks(): void {
			super.setCallbacks();
		}

		/**
		 * Add the animation on progress before applying progress value based on value change
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected setElementProgressValue(value: number): void {
			this.configs.Progress = value;

			// Add the animate to progress value, on value change
			this.animateOnValueChange();

			// Update the progress value and the valuenow accessibility property
			this.updatedProgressValue();
		}

		/**
		 * Method to set HTML elements reference
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this.progressElem = this.selfElement.querySelector(Constants.Dot + ProgressEnum.CssClass.Container);
			// Set Progress Circle content element
			this.contentElem = this.selfElement.querySelector(
				OSUI.Constants.Dot + Progress.ProgressEnum.CssClass.ProgressBarContent
			);
		}

		/**
		 * Method to unset callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected unsetCallbacks(): void {
			super.unsetCallbacks();
		}

		/**
		 * Method to unset HTML elements reference
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		protected unsetHtmlElements(): void {
			super.unsetHtmlElements();
		}

		/**
		 * Method to build the ProgressBar
		 *
		 * @memberof Bar
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setA11YProperties();

			this._setCssVariables();

			this.setCallbacks();

			// Ensure that this will run only at the Initialization
			if (!this.isBuilt) {
				// Make async to ensure that all css variables are assigned
				// Update according initial style
				Helper.AsyncInvocation(this.addInitialAnimation.bind(this));
			}

			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			switch (propertyName) {
				case ProgressEnum.Properties.Thickness:
					this._updateThickness();
					break;

				case ProgressEnum.Properties.Progress:
					this.setElementProgressValue(propertyValue as number);
					break;

				case ProgressEnum.Properties.ProgressColor:
					this._updateProgressColor();
					break;

				case ProgressEnum.Properties.Shape:
					this._updateShape();
					break;

				case ProgressEnum.Properties.TrailColor:
					this._updateTrailColor();
					break;
			}
		}

		/**
		 * Destroy ProgressBar
		 *
		 * @memberof OSFramework.Patterns.Progress.Bar.Bar
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			this.unsetCallbacks();
			super.dispose();
		}

		public progressApplyGradient(gradientType: string, colors: GradientColor): void {
			// Call super to clean and validate color string
			super.progressApplyGradient(gradientType, colors);
			// Stole gradient to later used on CSS Variable
			let _gradient;
			// Store final gradient string
			const _colorsString = [];

			// Make sure the string passed on the CSS Variable has the expected format (color X%)
			for (let i = 0; i < this.gradientLength; i++) {
				_colorsString.push(
					`${colors[i].Color} ${
						colors[i].Percentage !== -1
							? colors[i].Percentage + GlobalEnum.Units.Percentage
							: Constants.EmptyString
					}`
				);
			}

			// Compose the gradient structure, according to type
			switch (gradientType) {
				case ProgressEnum.Gradient.LinearDiagonally:
					_gradient = `linear-gradient(135deg, ${_colorsString})`;
					break;
				case ProgressEnum.Gradient.LinearHorizontal:
					_gradient = `linear-gradient(90deg, ${_colorsString})`;
					break;
				case ProgressEnum.Gradient.LinearVertical:
					_gradient = `linear-gradient(180deg, ${_colorsString})`;
					break;
				case ProgressEnum.Gradient.Radial:
					_gradient = `radial-gradient(${_colorsString})`;
					break;
			}

			// Set the gradient as CSS Variable, to be used on the CSS
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressGradient,
				_gradient
			);
		}
	}
}
