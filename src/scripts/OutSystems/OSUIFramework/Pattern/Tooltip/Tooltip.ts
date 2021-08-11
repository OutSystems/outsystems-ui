// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUIFramework.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// Store the ballon html element
		private _tooltipBallonElem: HTMLElement;
		private _tooltipBallonId: string;

		// Store all the classes strings used by the pattern
		private _tooltipClasses = {
			IsHover: 'is-hover',
			IsVisible: 'is-opened',
			Content: 'osui-tooltip_content',
			BalloonWrapper: 'osui-tooltip_balloon-wrapper',
		};

		// Store the content html element
		private _tooltipContentElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));
		}

		public build(): void {
			this.preBuild();

			// Set the Content html element
			this._tooltipContentElem = this._selfElem.querySelector('.' + this._tooltipClasses.Content);

			// Set the ballon html element
			this._tooltipBallonElem = this._selfElem.querySelector('.' + this._tooltipClasses.BalloonWrapper);
			this._tooltipBallonId = Helper.Attribute.Get(this._tooltipBallonElem, 'id');

			// Set default cssClass property ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.UpdateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}

			// Set default cssClass property IsHover values
			if (this._configs.IsHover) {
				this._selfElem.classList.add(this._tooltipClasses.IsHover);
			}

			// Set default cssClass property IsVisible values
			if (this._configs.IsVisible) {
				this._selfElem.classList.add(this._tooltipClasses.IsVisible);
			}

			// Set default cssClass property Position values
			if (this._configs.Position !== '') {
				this._tooltipBallonElem.classList.add(this._configs.Position);
			}

			// Add the Accessibility Attributes values
			Helper.Attribute.Set(this._tooltipContentElem, 'role', 'tooltip');
			Helper.Attribute.Set(this._tooltipContentElem, 'tabindex', '0');
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-describedby', this._tooltipBallonId);
			Helper.Attribute.Set(this._tooltipContentElem, 'aria-labelledby', this._tooltipBallonId);

			// Instance is properly created
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
						Helper.Style.ToogleClass(this._selfElem, this._tooltipClasses.IsHover);

						this._configs.IsHover = propertyValue;

						break;

					case Enum.Tooltip.IsVisible:
						Helper.Style.ToogleClass(this._selfElem, this._tooltipClasses.IsVisible);

						this._configs.IsVisible = propertyValue;

						break;

					case Enum.Tooltip.Position:
						if (this._configs.Position !== '') {
							Helper.Style.ToogleClass(this._tooltipBallonElem, this._configs.Position);
						}

						if (propertyValue !== '') {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							Helper.Style.ToogleClass(this._tooltipBallonElem, propertyValue);
						}

						this._configs.Position = propertyValue;

						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}
	}
}
