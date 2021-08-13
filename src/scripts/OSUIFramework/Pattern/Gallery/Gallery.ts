// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Gallery {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Gallery extends AbstractPattern<GalleryConfig> implements IGallery {
		private _gallery: HTMLElement;

		// Store all the classes strings used by the pattern
		private _galleryClasses = {
			GridGallery: 'grid-gallery',
		};

		// Store all the css property strings used by the pattern
		private _galleryCssProperties = {
			GridDesktop: '--grid-desktop',
			GridTablet: '--grid-tablet',
			GridPhone: '--grid-phone',
			GridGap: '--grid-gap',
			GridListDesktop: '--grid-list-desktop',
			GridListTablet: '--grid-list-tablet',
			GridListPhone: '--grid-list-phone',
		};

		private _galleryId: string;
		private _isEdge: boolean;
		private _root;

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
			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridGap,
				'var(--space-' + this.configs.GutterSize + ')'
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Desktop
		 *
		 * @private
		 */
		private _setItemsInDesktop(): void {
			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridDesktop,
				this.configs.ItemsInDesktop.toString()
			);
			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInDesktop++;

			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridListDesktop,
				this.configs.ItemsInDesktop.toString()
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Phone
		 *
		 * @private
		 */
		private _setItemsInPhone(): void {
			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridPhone,
				this.configs.ItemsInPhone.toString()
			);

			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInPhone++;

			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridListPhone,
				this.configs.ItemsInPhone.toString()
			);
		}

		/**
		 * Function used to set the Gallery's number of items per row in Tablet
		 *
		 * @private
		 */
		private _setItemsInTablet(): void {
			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridTablet,
				this.configs.ItemsInTablet.toString()
			);

			// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
			this.configs.ItemsInTablet++;

			Helper.Style.SetStyleAttribute(
				this._gallery,
				this._galleryCssProperties.GridListTablet,
				this.configs.ItemsInTablet.toString()
			);
		}

		public build(): void {
			super.build();

			//Build the gallery here
			this._root = document.documentElement;
			this._gallery = document.querySelector('.' + this._galleryClasses.GridGallery);
			this._isEdge = document.body.classList.contains('edge');

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
			if (Enum.Gallery[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				switch (propertyName) {
					case Enum.Gallery.ItemsInDesktop:
						this._configs.ItemsInDesktop = propertyValue;
						this._setItemsInDesktop();

						break;
					case Enum.Gallery.ItemsInTablet:
						this._configs.ItemsInTablet = propertyValue;

						this._setItemsInTablet();

						break;
					case Enum.Gallery.ItemsInPhone:
						this._configs.ItemsInPhone = propertyValue;

						this._setItemsInPhone();

						break;
					case Enum.Gallery.GutterSize:
						this._configs.GutterSize = propertyValue;

						this._setGutterSize();

						break;
				}
			}
		}
	}
}
