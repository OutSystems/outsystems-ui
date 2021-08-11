// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));
		}

		public build(): void {
			this._widgetId = Helper.GetElementByUniqueId(this.uniqueId).closest(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OutSystems.osuiAPI.Constants.dataBlockTag
			).id;

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			if (OutSystems.osuiAPI.Patterns.Enum.Tooltip[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case OutSystems.osuiAPI.Patterns.Enum.Tooltip.ExtendedClass:
						this.UpdateExtendedClass(this._htmlParentElem, this._configs[propertyName], propertyValue);

						break;

					case OutSystems.osuiAPI.Patterns.Enum.Tooltip.IsHover:
						if (propertyValue) {
							this._htmlParentElem.classList.add('is-hover');
						} else {
							this._htmlParentElem.classList.remove('is-hover');
						}

						break;

					case OutSystems.osuiAPI.Patterns.Enum.Tooltip.IsVisible:
						if (propertyValue) {
							this._htmlParentElem.classList.add('is-opened');
						} else {
							this._htmlParentElem.classList.remove('is-opened');
						}

						break;

					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					case OutSystems.osuiAPI.Patterns.Enum.Tooltip.Position:
						// eslint-disable-next-line no-case-declarations
						const ballonWrapper = this._htmlParentElem.querySelector('.osui-tooltip_balloon-wrapper');

						if (this._configs[propertyName] !== '') {
							ballonWrapper.classList.remove(this._configs[propertyName]);
						}

						if (propertyValue !== '') {
							ballonWrapper.classList.add(propertyValue);
						}

						break;

					default:
						throw Error(`changeProperty - Property '${propertyName}' can't be changed.`);
						break;
				}

				// update property
				this._configs[propertyName] = propertyValue;
			}
		}
	}
}
