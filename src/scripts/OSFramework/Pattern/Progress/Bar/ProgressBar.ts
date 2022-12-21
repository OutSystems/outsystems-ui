/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Progress.Bar {
	export class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressBarConfig(configs));
			this._progressType = ProgressEnum.ProgressTypes.Bar;
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
		private _updateProgressColor(value: string): void {
			this.configs.ProgressColor = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);
		}

		// Update progress shape based on value change
		private _updateShape(value: string): void {
			this.configs.Shape = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Shape,
				Helper.Dom.Styles.GetBorderRadiusValueFromShapeType(this.configs.Shape)
			);
		}

		// Update progress thickness based on value change
		private _updateThickness(value: number): void {
			this.configs.Thickness = value;

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Thickness,
				value + GlobalEnum.Units.Pixel
			);
		}

		// Update progress trail color based on value change
		private _updateTrailColor(value: string): void {
			this.configs.TrailColor = value;

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
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
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
			this._progressElem = this.selfElement.querySelector(Constants.Dot + ProgressEnum.CssClass.Container);
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

		public build(): void {
			super.build();

			this.setHtmlElements();

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
					this._updateThickness(propertyValue as number);
					break;

				case ProgressEnum.Properties.Progress:
					this.setElementProgressValue(propertyValue as number);
					break;

				case ProgressEnum.Properties.ProgressColor:
					this._updateProgressColor(propertyValue as string);
					break;

				case ProgressEnum.Properties.Shape:
					this._updateShape(propertyValue as string);
					break;

				case ProgressEnum.Properties.TrailColor:
					this._updateTrailColor(propertyValue as string);
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
	}
}
