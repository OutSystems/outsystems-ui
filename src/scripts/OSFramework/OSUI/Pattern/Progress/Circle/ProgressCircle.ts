/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
		private _blockParent: HTMLElement;
		// Circunference circle value
		private _circleCircumference: number;
		private _circleSize = 0;

		// Flag to check if the resize observer should be added
		private _needsResizeObserver = true;

		// ResizeOberver
		private _resizeObserver: ResizeObserver;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new ProgressCircleConfig(configs));
		}

		// Set the resizeObserver
		private _addResizeOberser(): void {
			this._resizeObserver = new ResizeObserver((entries) => {
				// We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
				requestAnimationFrame(() => {
					if (!Array.isArray(entries) || !entries.length) {
						return;
					}

					if (this._progressElem) {
						if (
							Helper.Dom.Styles.ContainsClass(
								this._progressElem,
								ProgressEnum.CssClass.AddInitialAnimation
							)
						) {
							this._progressElem.addEventListener(
								GlobalEnum.HTMLEvent.TransitionEnd,
								this._updateCircleProps.bind(this)
							);
						} else {
							this._updateCircleProps();
						}
					}
				});
			});

			this._resizeObserver.observe(this._blockParent);
		}

		// Check if the resizeOberver does not exist yet!
		private _checkResizeObserver(): void {
			if (!this._resizeObserver && this._needsResizeObserver) {
				// Create the Oberver
				this._addResizeOberser();
			} else if (this._resizeObserver && this._needsResizeObserver === false) {
				this._removeResizeOberver();
			}
		}

		// Convert progress value into offset to assign to our circle
		private _progressToOffset(): void {
			// Check which size will be applied on ProgressCircle
			if (
				this.configs.ProgressCircleSize !== OSFramework.OSUI.Constants.EmptyString &&
				this.configs.ProgressCircleSize !== (Enum.DefaultValues.DefaultSize as string) &&
				parseInt(this.configs.ProgressCircleSize) !== 0
			) {
				// Set the Progress Circle Size variable for calculations
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Enum.InlineStyleProp.ProgressCircleSize,
					this.configs.ProgressCircleSize
				);

				// Set the size of Progress Circle with the value defined through parameter
				this._circleSize = this.selfElement.clientWidth;
				this._needsResizeObserver = false;
			} else {
				// Get the pattern parent size, based on lower size by priority (to avoid overflowing the parent, as this will always be a square)
				if (this._blockParent.clientWidth > this._blockParent.clientHeight) {
					this._circleSize = this._blockParent.clientHeight;
				} else {
					this._circleSize = this._blockParent.clientWidth;
				}

				// Set the Progress Circle Size variable for calculations
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Enum.InlineStyleProp.ProgressCircleSize,
					this._circleSize + GlobalEnum.Units.Pixel
				);
				this._needsResizeObserver = true;
			}

			// Set the css variable to
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.InlineStyleProp.CircleSize,
				this._circleSize + GlobalEnum.Units.Pixel
			);

			const _radius = Math.floor(this._circleSize / 2 - this.configs.Thickness / 2);
			this._circleCircumference = _radius * 2 * Math.PI;

			// set the base values
			this._strokeDashoffset = this._strokeDasharray = this._circleCircumference;

			// Set the css variables that will be used at ProgressCircle
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.InlineStyleProp.CircleRadius,
				_radius + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.InlineStyleProp.StrokeDasharray,
				this._strokeDasharray
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);

			// Ensure that this will run only at the Initialization
			if (!this.isBuilt) {
				// Make async to ensure that all css variables are assigned
				// Update according initial style
				Helper.AsyncInvocation(this.addInitialAnimation.bind(this));
			} else {
				this._checkResizeObserver();
			}
		}

		// Remove the resizeObserver
		private _removeResizeOberver(): void {
			this._resizeObserver.disconnect();
			this._resizeObserver = undefined;
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
				this.configs.Shape === GlobalEnum.ShapeTypes.Sharp
					? ProgressEnum.ShapeTypes.Sharp
					: ProgressEnum.ShapeTypes.Round
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		// Trigger all the meethods responsible to proper update the Circle
		private _updateCircleProps(): void {
			this._progressToOffset();
			this._updateProgressValue();
		}

		// Update the valuenow accessibility property
		private _updateProgressValue(): void {
			// Update the progress value and the valuenow accessibility property
			this.updatedProgressValue();

			// Update the offset value
			this._strokeDashoffset =
				this._circleCircumference - (this.configs.Progress / 100) * this._circleCircumference;

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);
		}

		/**
		 * Add the initial animation to the pattern if it's applicable
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected addInitialAnimation(): void {
			// Check if the animation at init should be added
			if (this.configs.AnimateInitialProgress) {
				this.animateInitial();

				this._checkResizeObserver();

				// Set the progressValue into the element
				this._updateProgressValue();
			} else {
				// Since the initial animation was not added add the ResizeObserver
				this._addResizeOberser();
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected setCallbacks(): void {
			super.setCallbacks();
		}

		/**
		 * Method used to set the progrees value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected setElementProgressValue(value: number): void {
			this.configs.Progress = value;

			// Add the animate to progress value, on value change
			this.animateOnValueChange();

			this._checkResizeObserver();

			this._updateProgressValue();
		}

		/**
		 * Method used to set the HTML elements reference
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected setHtmlElements(): void {
			this._blockParent = document.getElementById(this.widgetId).parentElement;
			// Set the html reference that will be used to do all the needed calcs
			this._progressElem = this.selfElement.querySelector(Constants.Dot + Enum.CssClass.Progress);
		}

		/**
		 * Method to unset the callbacks
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected unsetCallbacks(): void {
			super.unsetCallbacks();
		}

		/**
		 * Method to unset the HTML elements reference
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected unsetHtmlElements(): void {
			this._blockParent = undefined;
			super.unsetHtmlElements();
		}

		/**
		 * Update progress value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected updateProgressColor(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.ProgressColor)
			);
		}

		/**
		 * Update shape type
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected updateShape(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Shape,
				this.configs.Shape === GlobalEnum.ShapeTypes.Sharp
					? ProgressEnum.ShapeTypes.Sharp
					: ProgressEnum.ShapeTypes.Round
			);
		}

		/**
		 * Update shape thickness
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected updateThickness(): void {
			this._updateCircleProps();

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.Thickness,
				this.configs.Thickness + GlobalEnum.Units.Pixel
			);
		}

		/**
		 * Update shape color
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected updateTrailColor(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this._setCssVariables();

			this._progressToOffset();

			this.setCallbacks();

			this.finishBuild();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Update the default values
			super.changeProperty(propertyName, propertyValue);

			switch (propertyName) {
				case ProgressEnum.Properties.Thickness:
					this.updateThickness();
					break;

				case ProgressEnum.Properties.Progress:
					this.setProgressValue(propertyValue as number);
					break;

				case ProgressEnum.Properties.ProgressColor:
					this.updateProgressColor();
					break;

				case ProgressEnum.Properties.ProgressCircleSize:
					this._resizeObserver?.unobserve(this._blockParent);
					this._updateCircleProps();
					this._resizeObserver?.observe(this._blockParent);
					break;

				case ProgressEnum.Properties.Shape:
					this.updateShape();

					break;

				case ProgressEnum.Properties.TrailColor:
					this.updateTrailColor();
					break;
			}
		}

		/**
		 * Destroy the ProgressCircle
		 *
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		public dispose(): void {
			super.dispose();

			this.unsetHtmlElements();

			this.unsetCallbacks();

			// Check if the resizeOberver already exists
			if (this._resizeObserver) {
				this._removeResizeOberver();
			}
		}
	}
}
