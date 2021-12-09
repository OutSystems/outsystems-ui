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
		private _inputStateToggle(isFocus: boolean | undefined): void {
			const inputHasText = this._inputElement && this._inputElement.value !== '';

			//let's check if we have something to do. Is the pattern built or (it's building) and we have text in the input?
			if (this.isBuilt || inputHasText) {
				//(Does the input have text or is it Focus) and it's currently inactive?
				if ((inputHasText || isFocus) && this._isLabelFocus === false) {
					//let's mark as active!
					Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.IsActive);
					this._isLabelFocus = true;
					//is the input empty and it's active and it's blur event
				} else if (inputHasText === false && this._isLabelFocus && isFocus === false) {
					Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.IsActive);
					this._isLabelFocus = false;
				}
			}
		}

		/**
		 * Set the callbacks that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof AnimatedLabel
		 */
		protected setCallbacks(): void {
			this._eventBlur = this._inputBlurCallback.bind(this);
			this._eventFocus = this._inputFocusCallback.bind(this);
			this._eventAnimationStart = this._inputFocusCallback.bind(this);

			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventAnimationStart);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof AnimatedLabel
		 */
		protected setHtmlElements(): void {
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
				this._inputStateToggle(undefined);
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
		 * @protected
		 * @memberof AnimatedLabel
		 */
		protected unsetCallbacks(): void {
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
		 * @protected
		 * @memberof AnimatedLabel
		 */
		protected unsetHtmlElements(): void {
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

				this.setHtmlElements();

				this.setCallbacks();

				this.finishBuild();
			});
		}

		/**
		 * Destroy the Animatedlabel.
		 *
		 * @memberof AnimatedLabel
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Update Label active status accordingly when the input info has changed.
		 *
		 * @memberof AnimatedLabel
		 */
		public updateOnRender(): void {
			// Do not run this instead the pattern is totally built
			if (this.isBuilt) {
				this._inputStateToggle(undefined);
			}
		}
	}
}
