// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventBallonContentOnClose: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnBlur: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnFocus: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventWindowClick: any;

		// Store the ballon html element
		private _tooltipBallonContentActiveElem: HTMLElement;
		private _tooltipBallonContentElem: HTMLElement;
		private _tooltipBallonWrapperElem: HTMLElement;
		private _tooltipBallonWrapperId: string;

		// Store the content html element
		private _tooltipContentElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));

			// Set the method that will be assigned to the window click event
			this._eventWindowClick = this._windowClick.bind(this);
			this._eventOnBlur = this._onBlur.bind(this);
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this.open.bind(this);
			this._eventBallonContentOnClose = this._updatePositionOnClose.bind(this);
		}

		// Add the tooltip Events
		private _addEvents(): void {
			// If tooltip should behave onMouseOver and it's visible by default
			if (this.configs.IsHover || this.configs.IsVisible) {
				// Add a window event that will be responsible to close it, if it's opend by default
				window.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventWindowClick);
			}

			// If tooltip should behave at onMouseClick
			if (!this.configs.IsHover) {
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			}

			// if the accessibility feature is enabled
			if (this._enableAccessibility) {
				// add the focus event in order to show the tooltip ballon when the toolTip content is focused
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
				this._tooltipContentElem.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
			}
		}

		// Check if the tooltip will be able to be opend at the defined position or a new position must be setted
		private _managePosition(): void {
			const _newPosition = BoundsPosition.CalcBounds(
				this._selfElem,
				this._tooltipBallonContentElem,
				this._tooltipBallonWrapperElem
			);

			if (_newPosition.removeCssClassPos && typeof _newPosition.removeCssClassPos === 'string') {
				Helper.Style.RemoveClass(this._tooltipBallonWrapperElem, _newPosition.removeCssClassPos);
			}

			if (_newPosition.addCssClassPos && typeof _newPosition.addCssClassPos === 'string') {
				this._configs.Position = _newPosition.addCssClassPos;
				Helper.Style.AddClass(this._tooltipBallonWrapperElem, this._configs.Position);
			}
		}

		// Method to close the tooltip at onBlur
		private _onBlur(): void {
			// Wait for next activeElement be active
			setTimeout(() => {
				// Check if a previous active element has been assigned
				if (this._tooltipBallonContentActiveElem) {
					this._tooltipBallonContentActiveElem.removeEventListener(
						GlobalEnum.HTMLEvent.Blur,
						this._eventOnBlur
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
					this._tooltipBallonContentActiveElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
				}
			}, 0);
		}

		// Trigger the tooltip at onClick behaviour
		private _onClick(): void {
			// Add a window event that will be responsible to close it, if it's opend by default
			window.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventWindowClick);

			this.open();
		}

		// Remove all the assigned Events
		private _removeEvents(): void {
			window.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventWindowClick);

			this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);

			this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
			this._tooltipContentElem.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);

			this._tooltipBallonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentOnClose
			);
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(
				this._tooltipContentElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Tooltip
			);

			Helper.Attribute.Set(this._tooltipContentElem, Constants.AccessibilityAttribute.TabIndex, '0');

			Helper.Attribute.Set(
				this._tooltipContentElem,
				Constants.AccessibilityAttribute.Aria.Describedby,
				this._tooltipBallonWrapperId
			);

			Helper.Attribute.Set(
				this._tooltipContentElem,
				Constants.AccessibilityAttribute.Aria.Labelledby,
				this._tooltipBallonWrapperId
			);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._tooltipContentElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.Content);
			this._tooltipBallonContentElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.BalloonContent);
			this._tooltipBallonWrapperElem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.BalloonWrapper);
			this._tooltipBallonWrapperId = Helper.Attribute.Get(this._tooltipBallonWrapperElem, 'id');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default IsHover cssClass property value
			if (this._configs.IsHover) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsHover);
			}

			// Set default IsVisible cssClass property value
			if (this._configs.IsVisible) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsVisible);
			}

			// Set default Position cssClass property value
			if (this._configs.Position !== '') {
				Helper.Style.AddClass(this._tooltipBallonWrapperElem, this._configs.Position);
			} else {
				this._configs.Position = 'bottom';
				Helper.Style.AddClass(this._tooltipBallonWrapperElem, this._configs.Position);
			}
		}

		// Used to update the tooltip position after it's closed
		private _updatePositionOnClose(): void {
			this._tooltipBallonContentElem.removeEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentOnClose
			);

			// Check if the tooltip has a defined cssClass position
			const hasPosition = Helper.Style.HasCssClassPosition(this._tooltipBallonWrapperElem);

			if (hasPosition && typeof hasPosition === 'string' && hasPosition !== this._configs.Position) {
				Helper.Style.RemoveClass(this._tooltipBallonWrapperElem, hasPosition);
			}

			this._managePosition();
		}

		// Close tooltip if user has clicked outside of it
		private _windowClick(e: MouseEvent): void {
			const _clickedElem = e.target as HTMLElement;
			const _closestElem = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem) {
				// Remove the Event
				window.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventWindowClick);

				// Close Tooltip
				this.close();
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this._addEvents();

			//OS takes a while to set the Widget Classes
			setTimeout(() => {
				this._managePosition();
			}, 0);

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.IsHover:
					this._configs.IsHover = propertyValue;

					if (this._configs.IsHover) {
						Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsHover);
					} else {
						Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.IsHover);
					}

					this._removeEvents();

					this._addEvents();

					break;

				case Enum.Properties.IsVisible:
					this._configs.IsVisible = propertyValue;

					if (this._configs.IsVisible) {
						Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsVisible);
					} else {
						Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.IsVisible);
					}

					this._removeEvents();

					this._addEvents();

					break;

				case Enum.Properties.Position:
					if (this._configs.Position !== '') {
						Helper.Style.ToggleClass(this._tooltipBallonWrapperElem, this._configs.Position);
					}

					if (propertyValue !== '') {
						Helper.Style.ToggleClass(this._tooltipBallonWrapperElem, propertyValue);
					}

					this._configs.Position = propertyValue;

					this._managePosition();

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Close the tooltip
		public close(): void {
			this._tooltipBallonContentElem.addEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventBallonContentOnClose
			);

			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.IsVisible);

			this._configs.IsVisible = false;
		}

		// Destroy the tooltip
		public dispose(): void {
			super.dispose();

			this._removeEvents();
		}

		// Open the tooltip
		public open(): void {
			this._managePosition();

			Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsVisible);

			this._configs.IsVisible = true;
		}
	}
}
