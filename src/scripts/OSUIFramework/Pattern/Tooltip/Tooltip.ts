// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Store if the accessibility feature is enabled
		private _enableAccessibility: boolean;

		// Store the Events
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnBlur: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnFocus: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventWindowClick: any;

		// Store the ballon html element
		private _tooltipBallonContentElem: HTMLElement;
		private _tooltipBallonWrapperElem: HTMLElement;
		private _tooltipBallonWrapperId: string;

		// Store the content html element
		private _tooltipContentElem: HTMLElement;
		// Store all the classes strings used by the pattern
		private _tooltipCssClass = {
			pattern: 'osui-tooltip',
			IsHover: 'is-hover',
			IsVisible: 'is-opened',
			Content: 'osui-tooltip_content',
			BalloonWrapper: 'osui-tooltip_balloon-wrapper',
			BalloonContent: 'osui-tooltip_balloon',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));

			// Set the method that will be assigned to the window click event
			this._eventWindowClick = this._windowClick.bind(this);
			this._eventOnBlur = this.close.bind(this);
			this._eventOnClick = this._onClick.bind(this);
			this._eventOnFocus = this.open.bind(this);
		}

		// Add the tooltip Events
		private _addEvents(): void {
			// If tooltip should behave onMouseOver and it's visible by default
			if (this.configs.IsHover || this.configs.IsVisible) {
				// Add a window event that will be responsible to close it, if it's opend by default
				window.addEventListener('click', this._eventWindowClick);
			}

			// If tooltip should behave at onMouseClick
			if (!this.configs.IsHover) {
				this._tooltipContentElem.addEventListener('click', this._eventOnClick);
			}

			// if the accessibility feature is enabled
			if (this._enableAccessibility) {
				// add the focus event in order to show the tooltip ballon when the toolTip content is focused
				this._tooltipContentElem.addEventListener('blur', this._eventOnBlur);
				this._tooltipContentElem.addEventListener('focus', this._eventOnFocus);
			}
		}

		// Trigger the tooltip at onClick behaviour
		private _onClick(): void {
			// Add a window event that will be responsible to close it, if it's opend by default
			window.addEventListener('click', this._eventWindowClick);

			this.open();
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._tooltipContentElem, 'role', 'tooltip');
			Helper.Attribute.Set(this._tooltipContentElem, 'tabindex', '0');
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-describedby', this._tooltipBallonWrapperId);
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-labelledby', this._tooltipBallonWrapperId);
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			// Check if the accessibility feature is enabled
			this._enableAccessibility = !!document.querySelector('.' + Constants.hasAccessibilityClass);

			// Set the html references that will be used to manage the cssClasses and atribute properties
			this._tooltipContentElem = this._selfElem.querySelector('.' + this._tooltipCssClass.Content);
			this._tooltipBallonContentElem = this._selfElem.querySelector('.' + this._tooltipCssClass.BalloonContent);
			this._tooltipBallonWrapperElem = this._selfElem.querySelector('.' + this._tooltipCssClass.BalloonWrapper);
			this._tooltipBallonWrapperId = Helper.Attribute.Get(this._tooltipBallonWrapperElem, 'id');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass('', this._configs.ExtendedClass);
			}

			// Set default IsHover cssClass property value
			if (this._configs.IsHover) {
				Helper.Style.AddClass(this._selfElem, this._tooltipCssClass.IsHover);
			}

			// Set default IsVisible cssClass property value
			if (this._configs.IsVisible) {
				Helper.Style.AddClass(this._selfElem, this._tooltipCssClass.IsVisible);
			}

			// Set default Position cssClass property value
			if (this._configs.Position !== '') {
				Helper.Style.AddClass(this._tooltipBallonWrapperElem, this._configs.Position);
			}
		}

		// Close tooltip if user has clicked outside of it
		private _windowClick(e: MouseEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest('.' + this._tooltipCssClass.pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem) {
				// Remove the Event
				window.removeEventListener('click', this._eventWindowClick);

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

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Tooltip[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Tooltip.ExtendedClass:
						this.UpdateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;

						break;

					case Enum.Tooltip.IsHover:
						Helper.Style.ToogleClass(this._selfElem, this._tooltipCssClass.IsHover);

						this._configs.IsHover = propertyValue;

						break;

					case Enum.Tooltip.IsVisible:
						Helper.Style.ToogleClass(this._selfElem, this._tooltipCssClass.IsVisible);

						this._configs.IsVisible = propertyValue;

						break;

					case Enum.Tooltip.Position:
						if (this._configs.Position !== '') {
							Helper.Style.ToogleClass(this._tooltipBallonWrapperElem, this._configs.Position);
						}

						if (propertyValue !== '') {
							Helper.Style.ToogleClass(this._tooltipBallonWrapperElem, propertyValue);
						}

						this._configs.Position = propertyValue;

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Close the tooltip
		public close(): void {
			Helper.Style.RemoveClass(this._selfElem, this._tooltipCssClass.IsVisible);

			this._configs.IsVisible = false;
		}

		// Destroy the tooltip
		public destroy(): void {
			super.destroy();

			window.removeEventListener('click', this._eventWindowClick);

			this._tooltipContentElem.removeEventListener('click', this._eventOnClick);

			this._tooltipContentElem.removeEventListener('blur', this._eventOnBlur);
			this._tooltipContentElem.removeEventListener('focus', this._eventOnFocus);
		}

		// Open the tooltip
		public open(): void {
			Helper.Style.AddClass(this._selfElem, this._tooltipCssClass.IsVisible);

			this._configs.IsVisible = true;
		}
	}
}
