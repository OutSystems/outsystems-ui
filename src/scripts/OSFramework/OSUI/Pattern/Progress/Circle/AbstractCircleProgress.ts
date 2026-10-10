/// <reference path="../AbstractProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	/**
	 * Vector of a linearGradient element, in objectBoundingBox units.
	 */
	export type LinearGradientCoords = {
		x1: number;
		x2: number;
		y1: number;
		y2: number;
	};

	/**
	 * Shared SVG circle geometry for Progress Circle and Progress Semi-Circle.
	 * Sweep and box fitting stay on the subclass so the full circle keeps its current dash and size output.
	 */
	export abstract class AbstractCircleProgress<C extends ProgressConfiguration> extends AbstractProgress<C> {
		// SVG defs gradient element
		private _gradientElem: SVGDefsElement;

		// ResizeOberver
		private _resizeObserver: ResizeObserver;

		// Store values to be assigned to the circle
		private _strokeDasharray: number;
		private _strokeDashoffset: number;

		// Parent element used to fit an auto-sized gauge
		protected blockParent: HTMLElement;
		// Circunference circle value
		protected circleCircumference: number;
		protected circleSize = 0;

		// Flag to check if the resize observer should be added
		protected needsResizeObserver = true;

		// Set as public, so that the coordinates can be customized using extesnibility. LinearHorizontal by default
		public linearGradientCoords: LinearGradientCoords = {
			x1: 1,
			x2: 1,
			y1: 0,
			y2: 1,
		};

		// Set as public, so that the coordinates can be customized using extesnibility
		public radialGradientCoords = {
			fr: Circle.Enum.DefaultValues.RadialFr,
			r: Circle.Enum.DefaultValues.RadialRadius,
		};

		// Set the resizeObserver
		private _addResizeOberser(): void {
			this._resizeObserver = new ResizeObserver((entries) => {
				// We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
				requestAnimationFrame(() => {
					if (!Array.isArray(entries) || !entries.length) {
						return;
					}

					if (this.progressElem) {
						if (
							Helper.Dom.Styles.ContainsClass(
								this.progressElem,
								ProgressEnum.CssClass.AddInitialAnimation
							)
						) {
							this.progressElem.addEventListener(
								GlobalEnum.HTMLEvent.TransitionEnd,
								this._updateCircleProps.bind(this)
							);
						} else {
							this._updateCircleProps();
						}
					}
				});
			});

			this._resizeObserver.observe(this.blockParent);
		}

		// Check if the resizeOberver does not exist yet!
		private _checkResizeObserver(): void {
			if (!this._resizeObserver && this.needsResizeObserver) {
				// Create the Oberver
				this._addResizeOberser();
			} else if (this._resizeObserver && this.needsResizeObserver === false) {
				this._removeResizeOberver();
			}
		}

		// Full circle writes one number. A partial sweep writes the arc plus an equal gap so the hidden half never paints.
		private _getDasharrayCssValue(): number | string {
			if (this.getSweepRatio() === 1) {
				return this._strokeDasharray;
			}

			return `${this._strokeDasharray} ${this._strokeDasharray}`;
		}

		// Convert progress value into offset to assign to our circle
		private _progressToOffset(): void {
			this._resolveBoxSize();

			// Set the css variable to
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.CircleSize,
				this.circleSize + GlobalEnum.Units.Pixel
			);

			const _radius = Math.floor(this.circleSize / 2 - this.configs.Thickness / 2);
			this.circleCircumference = _radius * 2 * Math.PI;

			// Sweep 1 keeps the circumference value untouched. Any other sweep scales it.
			const _arcLength =
				this.getSweepRatio() === 1
					? this.circleCircumference
					: this.circleCircumference * this.getSweepRatio();
			// set the base values
			this._strokeDashoffset = this._strokeDasharray = _arcLength;

			// Set the css variables that will be used at the gauge
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.CircleRadius,
				_radius + GlobalEnum.Units.Pixel
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.StrokeDasharray,
				this._getDasharrayCssValue()
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.StrokeDashoffset,
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

		// An explicit Size is applied as-is. Otherwise the gauge is fitted to the parent and kept in sync by the resize observer.
		private _resolveBoxSize(): void {
			if (
				this.configs.ProgressCircleSize !== OSFramework.OSUI.Constants.EmptyString &&
				this.configs.ProgressCircleSize !== (Circle.Enum.DefaultValues.Size as string) &&
				parseInt(this.configs.ProgressCircleSize) !== 0
			) {
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Circle.Enum.InlineStyleProp.ProgressCircleSize,
					this.configs.ProgressCircleSize
				);

				this.circleSize = this.selfElement.clientWidth;
				this.needsResizeObserver = false;
			} else {
				if (this.blockParent) {
					this.circleSize = this.fitToParent(this.blockParent.clientWidth, this.blockParent.clientHeight);
				}

				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Circle.Enum.InlineStyleProp.ProgressCircleSize,
					this.circleSize + GlobalEnum.Units.Pixel
				);
				this.needsResizeObserver = true;
			}
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

		// Method to compose coordinates string, to avoid code repetition
		private _setGradientCoords(gradientType: string): string {
			if (gradientType === Circle.Enum.GradientName.Radial) {
				return `fr="${this.radialGradientCoords.fr}" r="${this.radialGradientCoords.r}"`;
			} else {
				return `x1="${this.linearGradientCoords.x1}" y1="${this.linearGradientCoords.y1}" x2="${this.linearGradientCoords.x2}" y2="${this.linearGradientCoords.y2}"`;
			}
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
				this._strokeDasharray - (this.configs.Progress / 100) * this._strokeDasharray;

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.StrokeDashoffset,
				this._strokeDashoffset
			);
		}

		/**
		 * Add the initial animation to the pattern if it's applicable
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
		 * Label the gauge for assistive technology: by its content when present, with a generic label otherwise.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected setA11YProperties(): void {
			if (this.contentElem.innerHTML) Helper.A11Y.AriaLabelledBy(this.selfElement, this.contentElem.id);
			else Helper.A11Y.AriaLabel(this.selfElement, ProgressEnum.AriaLabel.Progress);
		}

		/**
		 * Method to set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected setCallbacks(): void {
			super.setCallbacks();
		}

		/**
		 * Method used to set the progrees value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected setHtmlElements(): void {
			this.blockParent = document.getElementById(this.widgetId)?.parentElement;
			// Set the html reference that will be used to do all the needed calcs
			this.progressElem = this.selfElement.querySelector(Constants.Dot + this.getProgressPathClass());
			// Set the content element
			this.contentElem = this.selfElement.querySelector(OSUI.Constants.Dot + this.getContentClass());
			// Set the <defs> element when using a svg gradient. Only after built, as the gradient is only available through Client Action
			if (this.isBuilt) {
				this._gradientElem = this.progressElem?.parentElement?.querySelector('defs');
			}
		}

		/**
		 * Method to unset the callbacks
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected unsetCallbacks(): void {
			super.unsetCallbacks();
		}

		/**
		 * Method to unset the HTML elements reference
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected unsetHtmlElements(): void {
			this.blockParent = undefined;
			this._gradientElem = undefined;
			super.unsetHtmlElements();
		}

		/**
		 * Update progress value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		protected updateTrailColor(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.TrailColor,
				Helper.Dom.Styles.GetColorValueFromColorType(this.configs.TrailColor)
			);
		}

		/**
		 * Method to build the circular progress gauge
		 *
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setA11YProperties();

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
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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
					this._resizeObserver?.unobserve(this.blockParent);
					this._updateCircleProps();
					this._resizeObserver?.observe(this.blockParent);
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
		 * Method to create the SVG Gradient
		 *
		 * @param {string} gradientId
		 * @param {string} gradientName
		 * @param {unknown} gradientCoords
		 * @param {number} gradientLenght
		 * @param {GradientColor} colors
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		public createSVGGradient(
			gradientId: string,
			gradientName: string,
			gradientCoords: unknown,
			gradientLenght: number,
			colors: GradientColor
		): void {
			// Start by removing the current gradient, in case there's already one created
			this._gradientElem?.remove();
			// Store gradient HTML that will be dynamically created
			let _gradient = Constants.EmptyString;

			// Create gradient stop elements dynamically, depending on number of color and percentages used
			for (let i = 0; i < gradientLenght; i++) {
				_gradient += `<stop offset="${
					// If the Percentage config is used, use that value, otherwise auto calculate based on the color array length
					colors[i].Percentage !== -1 ? colors[i].Percentage : Math.floor((i * 100) / gradientLenght)
				}%" stop-color="${colors[i].Color}"/>`;
			}

			// Compose the final SVG gradient, with the expected html structure
			const gradientSVG = `
				<defs>
					<${gradientName} id="${gradientId}" ${gradientCoords}">
						${_gradient}
					</${gradientName}>
				</defs>`;

			// Add the gradient inside the SVG element
			this.progressElem.parentElement.innerHTML += gradientSVG;
			// As we manipulate the DOM, we must update the elements references
			this.setHtmlElements();

			// Add the url as a css-variable, so that it can be referenced on the CSS
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Circle.Enum.InlineStyleProp.GradientURL,
				'url(#' + gradientId + ')'
			);
		}

		/**
		 * Destroy the circular progress gauge
		 *
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
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

		/**
		 * Method to apply a SVG Gradient
		 *
		 * @param {string} gradientType
		 * @param {GradientColor} colors
		 * @memberof OSFramework.Patterns.Progress.AbstractCircleProgress
		 */
		public progressApplyGradient(gradientType: string, colors: GradientColor): void {
			// Call super to clean and validate color string
			super.progressApplyGradient(gradientType, colors);
			// Store the expected gradient name to be used as html tag
			let _gradientName = Circle.Enum.GradientName.Linear;
			// Store the dynamic svg gradient id, to make sure it's unique for each progressCircle
			const _gradientId = Circle.Enum.DefaultValues.GradientId + this.uniqueId;

			// Set coordinates, according to gradient type. The linear vectors are
			// pattern-specific: each pattern compensates for its own CSS rotation.
			if (gradientType === ProgressEnum.Gradient.Radial) {
				_gradientName = Circle.Enum.GradientName.Radial;
			} else {
				this.linearGradientCoords = this.getLinearGradientCoords(gradientType);
			}

			// Update html string with the expected coordinates attributes
			const _gradientCoords = this._setGradientCoords(_gradientName);
			// Craete SVG Gradient
			this.createSVGGradient(_gradientId, _gradientName, _gradientCoords, this.gradientLength, colors);
		}

		/**
		 * Diameter that fits the given parent box when Size is auto.
		 *
		 * @param parentWidth parent client width in pixels
		 * @param parentHeight parent client height in pixels
		 * @returns the diameter in pixels
		 */
		protected abstract fitToParent(parentWidth: number, parentHeight: number): number;

		/**
		 * CSS class of the content placeholder, without the leading dot.
		 */
		protected abstract getContentClass(): string;

		/**
		 * Linear gradient vector for the given gradient type, in the SVG's
		 * pre-rotation unit box. Each pattern compensates for its own CSS rotation
		 * so the color ramp lands on the visible part of the stroke.
		 *
		 * @param gradientType one of the ProgressEnum.Gradient linear types
		 * @returns the x1/x2/y1/y2 vector for the linearGradient element
		 */
		protected abstract getLinearGradientCoords(gradientType: string): LinearGradientCoords;

		/**
		 * CSS class of the progress stroke, without the leading dot.
		 */
		protected abstract getProgressPathClass(): string;

		/**
		 * Fraction of the circumference that the stroke paints. 1 is a full circle.
		 */
		protected abstract getSweepRatio(): number;
	}
}
