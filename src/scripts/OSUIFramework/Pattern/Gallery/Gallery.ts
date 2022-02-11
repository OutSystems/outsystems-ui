// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Gallery {
	/**
	 * Defines the interface for OutSystemsUI Gallery Pattern
	 *
	 * @export
	 * @class Gallery
	 * @extends {AbstractPattern<GalleryConfig>}
	 * @implements {IGallery}
	 */
	export class Gallery extends AbstractPattern<GalleryConfig> implements IGallery {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new GalleryConfig(configs));
		}

		/**
		 * Function used to set the Gallery's items gap
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setItemsGap(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternItemsGap,
				`var(--space-${this.configs.ItemsGap})`
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Desktop
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setRowItemsDesktop(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternItemsDesktop,
				this.configs.RowItemsDesktop
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternListItemsDesktop,
				this.configs.RowItemsDesktop
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Phone
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setRowItemsPhone(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternItemsPhone,
				this.configs.RowItemsPhone
			);
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternListItemsPhone,
				this.configs.RowItemsPhone
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Tablet
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setRowItemsTablet(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternItemsTablet,
				this.configs.RowItemsTablet
			);

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.PatternListItemsTablet,
				this.configs.RowItemsTablet
			);
		}

		public build(): void {
			super.build();

			this._setRowItemsDesktop();

			this._setRowItemsTablet();

			this._setRowItemsPhone();

			this._setItemsGap();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Gallery
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.RowItemsDesktop:
						this._setRowItemsDesktop();
						break;
					case Enum.Properties.RowItemsTablet:
						this._setRowItemsTablet();
						break;
					case Enum.Properties.RowItemsPhone:
						this._setRowItemsPhone();
						break;
					case Enum.Properties.ItemsGap:
						this._setItemsGap();
						break;
				}
			}
		}
	}
}
