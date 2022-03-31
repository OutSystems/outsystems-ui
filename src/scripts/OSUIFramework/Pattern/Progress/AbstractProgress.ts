// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress {
	export abstract class AbstractProgress<C extends ProgressConfiguration>
		extends AbstractPattern<C>
		implements IProgress
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Set default Accessibility properties
		private _setAccessibilityProps(): void {
			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '0');

			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);

			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Label, 'progress');

			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Aria.ValueMin,
				ProgressEnum.Properties.MinProgressValue
			);

			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Aria.ValueMax,
				ProgressEnum.Properties.MaxProgressValue
			);
		}

		// Update valuenow Accessibility property and CssVariable that will be used to set the progress value into pattern
		protected updateValueNow(progressValue: string): void {
			Helper.Dom.Attribute.Set(this._selfElem, 'aria-valuenow', progressValue);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				ProgressEnum.InlineStyleProp.ProgressValue,
				progressValue + GlobalEnum.Units.Percentage
			);
		}

		public build(): void {
			super.build();

			this._setAccessibilityProps();
		}

		public setProgressValue(value: number): void {
			this.setElementProgressValue(value);
		}
		// Implement the _addInitialAnimation method since a transitionend event must be added, this must be implemented at childs level
		protected abstract addInitialAnimation(): void;

		protected abstract setElementProgressValue(value: number): void;
	}
}
