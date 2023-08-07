// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	export abstract class AbstractProgress<C extends ProgressConfiguration>
		extends AbstractPattern<C>
		implements IProgress
	{
		private _eventAnimateEntranceEnd: GlobalCallbacks.Generic;
		protected contentElem: HTMLElement;
		protected gradientLength: number;
		protected progressElem: HTMLElement;
		protected progressType: ProgressEnum.ProgressTypes;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this.progressElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);

			Helper.Dom.Styles.RemoveClass(this.progressElem, ProgressEnum.CssClass.AddInitialAnimation);
			Helper.Dom.Styles.RemoveClass(this.progressElem, ProgressEnum.CssClass.AnimateProgressChange);
		}

		// Set default Accessibility properties
		private _setAccessibilityProps(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.TabIndex, '0');

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Aria.ValueMin,
				ProgressEnum.Properties.MinProgressValue
			);

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Aria.ValueMax,
				ProgressEnum.Properties.MaxProgressValue
			);
		}

		/**
		 * Method to add the initial animation to progress
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected animateInitial(): void {
			// Do the initial animation
			Helper.Dom.Styles.AddClass(this.progressElem, ProgressEnum.CssClass.AddInitialAnimation);

			// Add the event to remove the cssClass responsible to add the initial animation
			this.progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
		}

		/**
		 * Method to add the animation to progress on value change
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected animateOnValueChange(): void {
			// Do the transition animation
			Helper.Dom.Styles.AddClass(this.progressElem, ProgressEnum.CssClass.AnimateProgressChange);

			// Add the event that will remove the responsible cssClass that added animation
			this.progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
		}

		/**
		 * Method to set the calbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected setCallbacks(): void {
			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		/**
		 * Method to unset the calbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected unsetCallbacks(): void {
			this._eventAnimateEntranceEnd = undefined;
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected unsetHtmlElements(): void {
			this.progressElem = undefined;
			this.contentElem = undefined;
		}

		/**
		 * Method to validate the value limits and apply the A11Y on progress, based on progress value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		protected updatedProgressValue(): void {
			// If negative value, set it as minimum progress value by default
			if (this.configs.Progress < ProgressEnum.Properties.MinProgressValue) {
				this.configs.Progress = ProgressEnum.Properties.MinProgressValue;

				console.warn(
					`The value of the Progress property on the '${this.widgetId}' ${
						this.progressType === ProgressEnum.ProgressTypes.Bar
							? GlobalEnum.PatternName.ProgressBar
							: GlobalEnum.PatternName.ProgressCircle
					} can't be smaller than '${ProgressEnum.Properties.MinProgressValue}'.`
				);
			}

			// If value is higher than the maximum progress value, assume the maximum progress value
			if (this.configs.Progress > ProgressEnum.Properties.MaxProgressValue) {
				this.configs.Progress = ProgressEnum.Properties.MaxProgressValue;

				console.warn(
					`The value of the Progress property on the '${this.widgetId}' ${
						this.progressType === ProgressEnum.ProgressTypes.Bar
							? GlobalEnum.PatternName.ProgressBar
							: GlobalEnum.PatternName.ProgressCircle
					} is higher than supported (${ProgressEnum.Properties.MaxProgressValue}).`
				);
			}

			// Update valuenow Accessibility property and CssVariable that will be used to set the progress value into pattern
			Helper.Dom.Attribute.Set(this.selfElement, 'aria-valuenow', this.configs.Progress.toString());

			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				ProgressEnum.InlineStyleProp.ProgressValue,
				this.configs.Progress.toString() + GlobalEnum.Units.Percentage
			);
		}

		public build(): void {
			super.build();

			this._setAccessibilityProps();
		}

		/**
		 * Method to apply a CSS Gradient to the Progress
		 *
		 * @param {string} gradientType
		 * @param {GradientColor} colors
		 * @memberof AbstractProgress
		 */
		public progressApplyGradient(gradientType: string, colors: GradientColor): void {
			this.gradientLength = Object.keys(colors).length;

			if (this.gradientLength < 2) {
				// Make API call fail and prevent adding a faulty CSS gradient
				throw Error(
					`Progress${this.progressType}(${this.uniqueId}): CSS ${gradientType} gradient needs at least two colors to work`
				);
			}
		}

		/**
		 * Method used to reset the progress value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		public resetProgressValue(): void {
			this.setElementProgressValue(this.configs.InitialProgress);
		}

		/**
		 * Method used to set the progress value
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.AbstractProgress
		 */
		public setProgressValue(value: number): void {
			this.setElementProgressValue(value);
		}

		// Common methods all Progress patterns must implement
		protected abstract addInitialAnimation(): void;
		protected abstract setElementProgressValue(value: number): void;
	}
}
