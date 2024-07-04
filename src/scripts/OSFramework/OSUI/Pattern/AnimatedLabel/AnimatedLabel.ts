// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.AnimatedLabel {
	/**
	 * Class that implements the AnimatedLabel pattern.
	 *
	 * @export
	 * @class AnimatedLabel
	 * @extends {AbstractPattern<AnimatedLabelConfig>}
	 * @implements {IAnimatedLabel}
	 */
	export class AnimatedLabel extends AbstractPattern<AnimatedLabelConfig> implements IAnimatedLabel {
		private _eventAnimationStart: GlobalCallbacks.Generic;
		private _eventBlur: GlobalCallbacks.Generic;
		private _eventFocus: GlobalCallbacks.Generic;
		private _eventKeyDown: GlobalCallbacks.Generic;

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
		 * Method to add Pattern Events
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _addEvents(): void {
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			this._inputElement.addEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventAnimationStart);
			if (this._inputElement.type === 'number') {
				this._inputElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeyDown);
			}
		}

		/**
		 * Method to set callback to the event onAnimationStart
		 *
		 * @private
		 * @param {AnimationEvent} e
		 * @memberof AnimatedLabel
		 */
		private _inputAnimationStartCallback(e: AnimationEvent): void {
			if (e.animationName === Enum.AnimationEvent.OnAutoFillStart) {
				this._inputStateToggle(true);
			}
		}

		/**
		 * Method to set callback to the event "blur" of the input
		 *
		 * @private
		 * @param {UIEvent} evt
		 * @memberof AnimatedLabel
		 */
		private _inputBlurCallback(evt: UIEvent): void {
			if (evt.type === GlobalEnum.HTMLEvent.Blur) {
				this._inputStateToggle(false);
			}
		}

		/**
		 * Method to set callback to the event "focus" of the input
		 *
		 * @private
		 * @param {UIEvent} evt
		 * @memberof AnimatedLabel
		 */
		private _inputFocusCallback(evt: UIEvent): void {
			if (evt.type === GlobalEnum.HTMLEvent.Focus) {
				this._inputStateToggle(true);
			}
		}

		/**
		 * Method to set callback to the event "keydown" of the input
		 *
		 * @private
		 * @param {KeyboardEvent} evt
		 * @memberof AnimatedLabel
		 */
		private _inputKeyDownCallback(evt: KeyboardEvent): void {
			if (evt.type === GlobalEnum.HTMLEvent.keyDown && this._inputElement.type === 'number') {
				const invalidChars = ['-', '+', 'e', 'E'];
				if (invalidChars.includes(evt.key) && this._inputElement.value === Constants.EmptyString) {
					this._inputStateToggle(true);
				}
			}
		}

		/**
		 * Method that implements the toggle of the state of the input.
		 * It can either add or remove the class "active" of the input.
		 *
		 * @private
		 * @param {boolean} [isFocus=false]
		 * @memberof AnimatedLabel
		 */
		private _inputStateToggle(isFocus = false): void {
			if (this.isBuilt) {
				// In this flag, we are checking if the input has value.
				// When the input is empty, the checkValidity() return true.
				// If the input type is number, value is empty and checkValidty() is false this means that the input has invalid value.
				const inputHasText =
					this._inputElement &&
					(this._inputElement.value !== Constants.EmptyString ||
						(this._inputElement.type === 'number' && this._inputElement.checkValidity() === false));

				if (this._isLabelFocus === false) {
					//let's check if we have something to do. Is the pattern built or (it's building) and we have text in the input?
					if (isFocus || inputHasText) {
						//(Does the input have text or is it Focus) and it's currently inactive?
						//let's mark as active!
						Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.IsActive);
						this._isLabelFocus = true;
						//is the input empty and it's active and it's blur event
					}
				} else if (inputHasText === false && isFocus === false) {
					Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClasses.IsActive);
					this._isLabelFocus = false;
				}
			}
		}

		/**
		 * Method to remove Pattern Events
		 *
		 * @private
		 * @memberof AnimatedLabel
		 */
		private _removeEvents(): void {
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventAnimationStart);
			if (this._inputElement.type === 'number') {
				this._inputElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeyDown);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the callbacks that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		protected setCallbacks(): void {
			this._eventBlur = this._inputBlurCallback.bind(this);
			this._eventFocus = this._inputFocusCallback.bind(this);
			this._eventAnimationStart = this._inputAnimationStartCallback.bind(this);
			this._eventKeyDown = this._inputKeyDownCallback.bind(this);
			this._addEvents();
		}

		/**
		 * method to update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		protected setHtmlElements(): void {
			this._labelPhElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClasses.LabelPlaceholder);
			this._inputPhElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClasses.InputPlaceholder);
			this._inputElement =
				(Helper.Dom.TagSelector(this._inputPhElement, GlobalEnum.DataBlocksTag.Input) as HTMLInputElement) ||
				(Helper.Dom.TagSelector(
					this._inputPhElement,
					GlobalEnum.DataBlocksTag.TextArea
				) as HTMLTextAreaElement);

			// Check if the input exist
			if (this._inputElement) {
				// clear the input's prompt, as it not supported when used inside AnimatedLabel
				this._inputElement.placeholder = '';

				this._inputStateToggle();
			} else {
				throw new Error(Enum.Messages.InputNotFound);
			}

			// Show a warning message if a label was in use
			if (Helper.Dom.TagSelector(this._labelPhElement, GlobalEnum.DataBlocksTag.Label) === undefined) {
				console.warn(Enum.Messages.LabelNotFound);
			}
		}

		/**
		 * Method to remove the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();
			this._eventBlur = undefined;
			this._eventFocus = undefined;
			this._eventAnimationStart = undefined;
			this._eventKeyDown = undefined;
		}

		/**
		 * Method to remove the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		protected unsetHtmlElements(): void {
			this._labelPhElement = undefined;
			this._inputPhElement = undefined;
			this._inputElement = undefined;
		}

		/**
		 * Method to build the animation label.
		 *
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
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
		 * Method to destroy the Animatedlabel.
		 *
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		public dispose(): void {
			this.unsetCallbacks();

			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Method to update Label active status accordingly when the input info has changed.
		 *
		 * @memberof OSFramework.Patterns.AnimatedLabel.AnimatedLabel
		 */
		public updateOnRender(): void {
			Helper.AsyncInvocation(() => {
				// Do not run this instead the pattern is totally built
				if (this.isBuilt) {
					this._inputStateToggle();
				}
			});
		}
	}
}
