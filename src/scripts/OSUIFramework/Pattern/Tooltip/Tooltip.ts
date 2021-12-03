// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		private _eventBallonContentClose: Callbacks.Generic;
		private _eventBlur: Callbacks.Generic;
		private _eventClick: Callbacks.Generic;
		private _eventFocus: Callbacks.Generic;
		private _globalEventBody: Callbacks.Generic;

		// Store the ballon html element
		private _tooltipBallonContentActiveElem: HTMLElement;
		private _tooltipBallonContentElem: HTMLElement;
		private _tooltipBallonWrapperElem: HTMLElement;

		// Store the content html element
		private _tooltipContentElem: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TooltipConfig(configs));
			this.setCallbacks();
		}

		// Add the tooltip Events
		private _addEvents(): void {
			// If tooltip should behave onMouseOver and it's visible by default
			if (this.configs.IsHover || this.configs.IsVisible) {
				// Add a window event that will be responsible to close it, if it's opend by default
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._globalEventBody);
			}

			// If tooltip should behave at onMouseClick
			if (this.configs.IsHover === false) {
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
			}
		}

		// Used to update the tooltip position after it's closed
		private _ballonCloseCallback(): void {
			this._tooltipBallonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentClose
			);

			// Check if the tooltip has a defined cssClass position
			const hasPosition = BoundsPosition.GetElementPositionClass(this._tooltipBallonWrapperElem);

			if (hasPosition && hasPosition !== this.configs.Position) {
				Helper.Dom.Styles.RemoveClass(this._tooltipBallonWrapperElem, hasPosition);
			}

			this._managePosition();
		}

		// Method to close the tooltip at onBlur
		private _blurCallback(): void {
			// Wait for next activeElement be active
			Helper.AsyncInvocation(() => {
				// Check if a previous active element has been assigned
				if (this._tooltipBallonContentActiveElem) {
					this._tooltipBallonContentActiveElem.removeEventListener(
						GlobalEnum.HTMLEvent.Blur,
						this._eventBlur
					);
				}

				// Get the closest element in order to check if the activeElement is inside this TooltipBallon
				const _closestElem = document.activeElement.closest(Constants.Dot + Enum.CssClass.Pattern);
				if (_closestElem !== this._selfElem) {
					// Close Tooltip
					this.close();
				} else {
					// Add the blur event in order to proper close the tooltip after its blur
					this._tooltipBallonContentActiveElem = document.activeElement as HTMLElement;
					this._tooltipBallonContentActiveElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
				}
			});
		}

		// Close tooltip if user has clicked outside of it
		private _bodyClickCallback(eventName: string, e: MouseEvent): void {
			const _clickedElem = e.target as HTMLElement;
			const _closestElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem) {
				// Remove the Event
				Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._globalEventBody);

				// Close Tooltip
				this.close();
			}
		}

		// Trigger the tooltip at onClick behaviour
		private _clickCallback(): void {
			// Add a window event that will be responsible to close it, if it's opend by default
			Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._globalEventBody);

			this._focusCallback();
		}

		// Open the tooltip
		private _focusCallback(): void {
			this._managePosition();

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsVisible);

			this.configs.IsVisible = true;
		}

		/**
		 * Check if the tooltip will be able to be opend at the defined position or a new position must be setted
		 *
		 * @private
		 * @memberof Tooltip
		 */
		private _managePosition(): void {
			const _newPosition = BoundsPosition.CalcBounds(
				this._selfElem,
				this._tooltipBallonContentElem,
				this._tooltipBallonWrapperElem
			);

			if (_newPosition.oldPositionCssClass !== undefined) {
				Helper.Dom.Styles.RemoveClass(this._tooltipBallonWrapperElem, _newPosition.oldPositionCssClass);
			}

			if (_newPosition.newPositionCssClass !== undefined) {
				this.configs.Position = BoundsPosition.GetPositionByClass(_newPosition.newPositionCssClass);
				Helper.Dom.Styles.AddClass(this._tooltipBallonWrapperElem, this.configs.Position);
			}
		}

		private _removeEvents(): void {
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._globalEventBody);

			this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);

			this._tooltipBallonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentClose
			);
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _setA11YEvents() {
			// if the accessibility feature is enabled
			if (Helper.DeviceInfo.HasAccessibilityEnabled) {
				// add the focus event in order to show the tooltip ballon when the toolTip content is focused
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default IsHover cssClass property value
			if (this.configs.IsHover) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHover);
			}

			// Set default IsVisible cssClass property value
			if (this.configs.IsVisible) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsVisible);
			}

			// Set default Position cssClass property value
			Helper.Dom.Styles.AddClass(this._tooltipBallonWrapperElem, this.configs.Position);
		}

		private _setIsHover(): void {
			if (this.configs.IsHover) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsHover);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsHover);
			}

			this._removeEvents();

			this._addEvents();
		}

		private _setIsVisible(): void {
			if (this.configs.IsVisible) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsVisible);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsVisible);
			}

			this._removeEvents();

			this._addEvents();
		}

		private _setPosition(oldPosition: string) {
			Helper.Dom.Styles.RemoveClass(this._tooltipBallonWrapperElem, oldPosition);
			Helper.Dom.Styles.AddClass(this._tooltipBallonWrapperElem, this.configs.Position);

			this._managePosition();
		}

		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _unsetA11YEvents() {
			// if the accessibility feature is enabled
			if (Helper.DeviceInfo.HasAccessibilityEnabled) {
				// add the focus event in order to show the tooltip ballon when the toolTip content is focused
				this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventBlur);
				this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocus);
			}
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleTooltip(this._tooltipContentElem);
			Helper.A11Y.TabIndexTrue(this._tooltipContentElem);

			const tooltipBallonWrapperId = Helper.Dom.Attribute.Id(this._tooltipBallonWrapperElem);
			Helper.A11Y.AriaDescribedBy(this._tooltipContentElem, tooltipBallonWrapperId);
			Helper.A11Y.AriaLabelledBy(this._tooltipContentElem, tooltipBallonWrapperId);
		}

		/**
		 * Set the method that will be assigned to the window click event
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected setCallbacks(): void {
			this._globalEventBody = this._bodyClickCallback.bind(this);
			this._eventBlur = this._blurCallback.bind(this);
			this._eventClick = this._clickCallback.bind(this);
			this._eventFocus = this._focusCallback.bind(this);
			this._eventBallonContentClose = this._ballonCloseCallback.bind(this);
		}

		// Update info based on htmlContent
		protected setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._tooltipContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.Content);
			this._tooltipBallonContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.BalloonContent);
			this._tooltipBallonWrapperElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.BalloonWrapper);
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Tooltip
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();
			this._unsetA11YEvents();

			this._globalEventBody = undefined;
			this._eventBlur = undefined;
			this._eventClick = undefined;
			this._eventFocus = undefined;
			this._eventBallonContentClose = undefined;
		}
		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof AbstractPattern
		 */
		protected unsetHtmlElements(): void {
			this._tooltipContentElem = undefined;
			this._tooltipBallonContentElem = undefined;
			this._tooltipBallonWrapperElem = undefined;
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this._setInitialCssClasses();

			this.setA11YProperties();
			this._setA11YEvents();

			this._addEvents();

			//OS takes a while to set the Widget Classes
			Helper.AsyncInvocation(() => {
				this._managePosition();
				this.finishBuild();
			});
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			const oldPosition = this.configs.Position;
			super.changeProperty(propertyName, propertyValue);
			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsHover:
						this._setIsHover();

						break;

					case Enum.Properties.IsVisible:
						this._setIsVisible();

						break;

					case Enum.Properties.Position:
						this._setPosition(oldPosition);

						break;
				}
			}
		}

		// Close the tooltip
		public close(): void {
			this._tooltipBallonContentElem.addEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentClose
			);

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsVisible);

			this.configs.IsVisible = false;
		}

		// Destroy the tooltip
		public dispose(): void {
			super.dispose();

			this.unsetCallbacks();
			this.unsetHtmlElements();
		}

		public open(): void {
			this._focusCallback();
		}
	}
}
