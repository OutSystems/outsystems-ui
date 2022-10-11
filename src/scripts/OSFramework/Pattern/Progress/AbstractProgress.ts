// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Progress {
	export abstract class AbstractProgress<C extends ProgressConfiguration>
		extends AbstractPattern<C>
		implements IProgress
	{
		private _eventAnimateEntranceEnd: GlobalCallbacks.Generic;
		protected _progressElem: HTMLElement;
		protected _progressType: ProgressEnum.ProgressTypes;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// remove the added transitionEnd event and the cssClass added at the beginning
		private _animateEntranceEnd(): void {
			this._progressElem.removeEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);

			Helper.Dom.Styles.RemoveClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);
			Helper.Dom.Styles.RemoveClass(this._progressElem, ProgressEnum.CssClass.AnimateProgressChange);
		}

		// Set default Accessibility properties
		private _setAccessibilityProps(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.TabIndex, '0');

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);

			Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.Aria.Label, 'progress');

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

		// Method to add the initial animation to progress
		protected animateInitial(): void {
			// Do the initial animation
			Helper.Dom.Styles.AddClass(this._progressElem, ProgressEnum.CssClass.AddInitialAnimation);

			// Add the event to remove the cssClass responsible to add the initial animation
			this._progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
		}

		// Method to add the animation to progress on value change
		protected animateOnValueChange(): void {
			// Do the transition animation
			Helper.Dom.Styles.AddClass(this._progressElem, ProgressEnum.CssClass.AnimateProgressChange);

			// Add the event that will remove the responsible cssClass that added animation
			this._progressElem.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._eventAnimateEntranceEnd);
		}

		protected setCallbacks(): void {
			this._eventAnimateEntranceEnd = this._animateEntranceEnd.bind(this);
		}

		protected unsetCallbacks(): void {
			this._eventAnimateEntranceEnd = undefined;
		}

		protected unsetHtmlElements(): void {
			this._progressElem = undefined;
		}

		// Method to validate the value limits and apply the A11Y on progress, based on progress value
		protected updatedProgressValue(): void {
			// If negative value, set it as minimum progress value by default
			if (this.configs.Progress < ProgressEnum.Properties.MinProgressValue) {
				this.configs.Progress = ProgressEnum.Properties.MinProgressValue;

				console.warn(
					`The value of the Progress property on the '${this.widgetId}' ${
						this._progressType === ProgressEnum.ProgressTypes.Bar
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
						this._progressType === ProgressEnum.ProgressTypes.Bar
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

		public resetProgressValue(): void {
			this.setElementProgressValue(this.configs.InitialProgress);
		}

		public setProgressValue(value: number): void {
			this.setElementProgressValue(value);
		}

		// Implement the _addInitialAnimation method since a transitionend event must be added, this must be implemented at childs level
		protected abstract addInitialAnimation(): void;

		protected abstract setElementProgressValue(value: number): void;
	}
}
