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
		 * Function used to set the Gallery's number of items per row in Desktop
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setGutterSize(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridGap,
				`var(--space-${this.configs.GutterSize})`
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Desktop
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setItemsInDesktop(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridDesktop,
				this.configs.ItemsInDesktop
			);
			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInDesktop++;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridListDesktop,
				this.configs.ItemsInDesktop
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Phone
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setItemsInPhone(): void {
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssVariables.GridPhone, this.configs.ItemsInPhone);

			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInPhone++;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridListPhone,
				this.configs.ItemsInPhone
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Tablet
		 *
		 * @private
		 * @memberof Gallery
		 */
		private _setItemsInTablet(): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridTablet,
				this.configs.ItemsInTablet
			);

			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInTablet++;

			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssVariables.GridListTablet,
				this.configs.ItemsInTablet
			);
		}

		public build(): void {
			super.build();

			this._setItemsInDesktop();

			this._setItemsInTablet();

			this._setItemsInPhone();

			this._setGutterSize();

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
					case Enum.Properties.ItemsInDesktop:
						this._setItemsInDesktop();
						break;
					case Enum.Properties.ItemsInTablet:
						this._setItemsInTablet();
						break;
					case Enum.Properties.ItemsInPhone:
						this._setItemsInPhone();
						break;
					case Enum.Properties.GutterSize:
						this._setGutterSize();
						break;
				}
			}
		}
	}
}
