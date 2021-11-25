// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AnimatedLabel {
	/**
	 * Class that implements the AnimatedLabel pattern.
	 *
	 * @export
	 * @class AnimatedLabel
	 * @extends {AbstractPattern<AnimatedLabelConfig>}
	 * @implements {IAnimatedLabel}
	 */
	export class AnimatedLabel extends AbstractPattern<AnimatedLabelConfig> implements IAnimatedLabel {
		private _eventAnimationStart: Callbacks.Generic;
		private _eventBlur: Callbacks.Generic;
		private _eventFocus: Callbacks.Generic;

		// Set the input html element
		private _inputElement: HTMLInputElement | HTMLTextAreaElement;

		// Set the inputPlaceholder html element
		private _inputPhElement: HTMLElement;

		// Flag that will be manage if the label is active
		private _isLabelFocus: boolean;

		// Set the labelPlaceholder html element
		private _labelPhElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AnimatedLabelConfig(configs));
			this._isLabelFocus = false;
		}

		/**
		 * Callback to the event "blur" of the input.
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _inputBlurCallback(): void {
			this._inputStateToggle(false);
		}

		/**
		 * Callback to the event "focus" of the input.
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _inputFocusCallback(): void {
			this._inputStateToggle(true);
		}

		/**
		 * Method that implements the toggle of the state of the input.
		 * It can either add or remove the class "active" of the input.
		 *
		 * @private
		 * @param {boolean} isFocus
		 * @memberof AnimatedLabel
		 */
		private _inputStateToggle(isFocus: boolean): void {
			//if the input is empty, and there's a change of state, then we want to do something!
			if (this._inputElement.value === '' && this._isLabelFocus !== isFocus) {
				if (isFocus) {
					Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.IsActive);
				} else if (this.isBuilt) {
					Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.IsActive);
				}
				this._isLabelFocus = isFocus;
			}
		}

		/**
		 * Set the callbacks that will be assigned to the window click event
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _setCallbacks(): void {
			this._eventBlur = this._inputBlurCallback.bind(this);
			this._eventFocus = this._inputFocusCallback.bind(this);
			this._eventAnimationStart = this._inputFocusCallback.bind(this);

			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventAnimationStart);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			this._labelPhElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClasses.LabelPlaceholder);
			this._inputPhElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClasses.InputPlaceholder);
			this._inputElement =
				(Helper.Dom.TagSelector(this._inputPhElement, GlobalEnum.DataBlocksTag.Input) as HTMLInputElement) ||
				(Helper.Dom.TagSelector(
					this._inputPhElement,
					GlobalEnum.DataBlocksTag.TextArea
				) as HTMLTextAreaElement);

			// Check if the input exist
			if (this._inputElement) {
				this._inputStateToggle(this._inputElement.value !== '');
			} else {
				throw new Error(Enum.Messages.InputNotFound);
			}

			// Show a warning message if a label was in use
			if (Helper.Dom.TagSelector(this._labelPhElement, GlobalEnum.DataBlocksTag.Label) === undefined) {
				console.warn(Enum.Messages.LabelNotFound);
			}
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _unsetCallbacks(): void {
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventAnimationStart);

			this._eventBlur = undefined;
			this._eventFocus = undefined;
			this._eventAnimationStart = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _unsetHtmlElements(): void {
			this._labelPhElement = undefined;
			this._inputPhElement = undefined;
			this._inputElement = undefined;
		}

		/**
		 * Builds the animation label.
		 *
		 * @memberof AnimatedLabel
		 */
		public build(): void {
			//OS takes a while to set the TextArea
			Helper.AsyncInvocation(() => {
				super.build();

				this._setHtmlElements();

				this._setCallbacks();

				this.finishBuild();
			});
		}

		/**
		 * Destroy the Animatedlabel.
		 *
		 * @memberof AnimatedLabel
		 */
		public dispose(): void {
			super.dispose();
			this._unsetCallbacks();
			this._unsetHtmlElements();
		}

		/**
		 * Update Label active status accordingly when the input info has changed.
		 *
		 * @memberof AnimatedLabel
		 */
		public updateOnRender(): void {
			// Do not run this instead the pattern is totally built
			if (this.isBuilt) {
				this._inputStateToggle(this._inputElement.value !== '');
			}
		}
	}
}
