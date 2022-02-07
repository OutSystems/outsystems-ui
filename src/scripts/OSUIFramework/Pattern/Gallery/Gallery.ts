/// <reference path="../AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Gallery {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Gallery extends AbstractPattern<GalleryConfig> implements IGallery {
		// Store all the css property strings used by the pattern

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new GalleryConfig(configs));
		}

		/**
		 * Function used to set the Gallery's gutter size
		 *
		 * @private
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

			// Set Items
			this._setItemsInDesktop();
			this._setItemsInTablet();
			this._setItemsInPhone();

			// Set Gutter
			this._setGutterSize();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Properties.ItemsInDesktop:
						this._configs.ItemsInDesktop = propertyValue;
						this._setItemsInDesktop();
						break;
					case Enum.Properties.ItemsInTablet:
						this._configs.ItemsInTablet = propertyValue;
						this._setItemsInTablet();
						break;
					case Enum.Properties.ItemsInPhone:
						this._configs.ItemsInPhone = propertyValue;
						this._setItemsInPhone();
						break;
					case Enum.Properties.GutterSize:
						this._configs.GutterSize = propertyValue;
						this._setGutterSize();
						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}
	}
}
