// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex {
	/**
	 *  Class that implements the SectionIndex pattern.
	 *
	 * @export
	 * @class SectionIndex
	 * @extends {AbstractPattern<SectionIndexConfig>}
	 * @implements {ISectionIndex}
	 */
	export class SectionIndex extends AbstractPattern<SectionIndexConfig> implements ISectionIndex {
		// Store the current sectionIndexItem active
		private _activeSectionIndexItem: Patterns.SectionIndexItem.ISectionIndexItem;
		// Store the content padding
		private _contentPaddingTop: number;
		// Store the header height
		private _headerHeight: number;
		// Store flag that shows if we are leading with a browser that needs polyfill
		private _isUnsupportedBrowser: boolean;
		// Store the distance between the window top and the content
		private _offset: number;
		// Store the SectionIndex Items of this SectionIndex
		private _sectionIndexItems: Map<string, Patterns.SectionIndexItem.ISectionIndexItem>;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexConfig(configs));
			this._sectionIndexItems = new Map<string, Patterns.SectionIndexItem.ISectionIndexItem>();
		}

		/**
		 * Method to set the SectionIndex IsFixed
		 *
		 * @private
		 * @memberof SectionIndex
		 */
		private _setIsFixed(): void {
			if (this.configs.IsFixed) {
				Helper.Dom.Styles.AddClass(this._selfElem, 'sticky');
				this._selfElem.style.setProperty('--top-position', this._offset + 'px');
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, 'sticky');
			}
		}

		/**
		 * Method used to recalculate the position of items on the sectionIndex
		 *
		 * @memberof SectionIndex
		 */
		private _setUpSectionIndex(): void {
			const Header = document.querySelector('.header') as HTMLElement;
			this._contentPaddingTop = parseInt(
				window.getComputedStyle(document.querySelector('.main-content')).getPropertyValue('padding-top')
			);
			if (Header) {
				this._headerHeight = Header.offsetHeight;
			} else {
				this._headerHeight = 0;
			}

			this._offset = this._headerHeight + this._contentPaddingTop;

			this._setIsFixed();

			this._isUnsupportedBrowser =
				Helper.Dom.Styles.ContainsClass(document.body, 'edge') ||
				Helper.Dom.Styles.ContainsClass(document.body, 'safari');

			// Check for browsers that don't support ScrollIntoView to call Polyfill
			if (this.configs.SmoothScrolling && this._isUnsupportedBrowser) {
				//callPolyfill();
			}
		}

		/**
		 * Method to add Item to the list
		 *
		 * @param {string} uniqueId
		 * @param {SectionIndexItem.ISectionIndexItem} sectionIndexItem
		 * @memberof SectionIndex
		 */
		public addSectionIndexItem(uniqueId: string, sectionIndexItem: SectionIndexItem.ISectionIndexItem): void {
			this._sectionIndexItems.set(uniqueId, sectionIndexItem);

			// In case the accordion is built, it means we're adding an item dynamically, after it's first setup.
			if (this.isBuilt) {
				//Recalculate positions in the array.
				this._setUpSectionIndex();
			}
		}

		/**
		 *  Builds the SectionIndex.
		 *
		 * @memberof SectionIndex
		 */
		public build(): void {
			super.build();

			this._setUpSectionIndex();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof SectionIndex
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsFixed:
						this._setIsFixed();
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof SectionIndex
		 */
		public dispose(): void {
			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Actual method that will do the scroll.
		 *
		 * @param {SectionIndexItem.ISectionIndexItem} targetElement
		 * @memberof SectionIndex
		 */
		public setActiveElement(targetElement: SectionIndexItem.ISectionIndexItem): void {
			if (targetElement) {
				// Remove old sectionIndexItem as active
				if (this._activeSectionIndexItem) {
					this._activeSectionIndexItem.removeActiveElement();
				}
				OutSystems.OSUI.Utils.ScrollToElement(
					targetElement.sectionIndexItemTargetId,
					this.configs.SmoothScrolling,
					this._offset
				);
				// Set new sectionIndexItem as active
				targetElement.setActiveElement();
				this._activeSectionIndexItem = targetElement;
			}
		}
	}
}
