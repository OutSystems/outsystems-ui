// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Store the ballon html element
		private _tooltipBallonContentElem: HTMLElement;
		private _tooltipBallonWrapperElem: HTMLElement;
		private _tooltipBallonWrapperId: string;

		// Store the content html element
		private _tooltipContentElem: HTMLElement;

		// Store all the classes strings used by the pattern
		private _tooltipCssClass = {
			IsHover: 'is-hover',
			IsVisible: 'is-opened',
			Content: 'osui-tooltip_content',
			BalloonWrapper: 'osui-tooltip_balloon-wrapper',
			BalloonContent: 'osui-tooltip_balloon',
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(this._tooltipContentElem, 'role', 'tooltip');
			Helper.Attribute.Set(this._tooltipContentElem, 'tabindex', '0');
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-describedby', this._tooltipBallonWrapperId);
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-labelledby', this._tooltipBallonWrapperId);
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._tooltipContentElem = this._selfElem.querySelector('.' + this._tooltipCssClass.Content);
			this._tooltipBallonContentElem = this._selfElem.querySelector('.' + this._tooltipCssClass.BalloonContent);
			this._tooltipBallonWrapperElem = this._selfElem.querySelector('.' + this._tooltipCssClass.BalloonWrapper);
			this._tooltipBallonWrapperId = Helper.Attribute.Get(this._tooltipBallonWrapperElem, 'id');
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
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

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Tooltip[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Tooltip.ExtendedClass:
						this.updateExtendedClass(this._configs.ExtendedClass, propertyValue);

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
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		}

		// Open the tooltip
		public open(): void {
			Helper.Style.AddClass(this._selfElem, this._tooltipCssClass.IsVisible);
		}
	}
}
