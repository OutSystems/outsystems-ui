// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndexItem {
	/**
	 *  Class that implements the SectionIndexItem pattern.
	 *
	 * @export
	 * @class SectionIndexItem
	 * @extends {AbstractPattern<SectionIndexItemConfig>}
	 * @implements {ISectionIndexItem}
	 */
	export class SectionIndexItem extends AbstractPattern<SectionIndexItemConfig> implements ISectionIndexItem {
		// Store the on click event
		private _eventOnSectionIndexItemClick: Callbacks.Generic;
		// Store if this is the current active item
		private _isActive = false;
		//Stores the keyboard callback function
		private _keyBoardCallback: Callbacks.Generic;
		// Stores the parent of the item (if it exists)
		private _sectionIndexItemParent: Patterns.SectionIndex.ISectionIndex;
		// Stores the Target element Id of this item
		public sectionIndexItemTargetId: string;

		constructor(uniqueId: string, configs: JSON, sectionIndex?: Patterns.SectionIndex.ISectionIndex) {
			super(uniqueId, new SectionIndexItemConfig(configs));
			this._sectionIndexItemParent = sectionIndex;
		}

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @param {Event} event
		 * @memberof SectionIndexItem
		 */
		private _handleClickEvent(event: Event): void {
			event.preventDefault();
			event.stopPropagation();

			this._sectionIndexItemParent.setActiveElement(this);
		}

		/**
		 * A11y keyboard navigation
		 *
		 * @private
		 * @param {KeyboardEvent} event
		 * @memberof SectionIndexItem
		 */
		private _handleOnKeyboardPress(event: KeyboardEvent): void {
			//If esc, Close AccordionItem
			if (event.key === GlobalEnum.Keycodes.Space || event.key === GlobalEnum.Keycodes.Enter) {
				this._handleClickEvent(event);
			}
		}

		/**
		 * Method to set the event listeners
		 *
		 * @private
		 * @memberof SectionIndexItem
		 */
		private _setUpEvents(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnSectionIndexItemClick);
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._keyBoardCallback);
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof SectionIndexItem
		 */
		protected setCallbacks(): void {
			this._eventOnSectionIndexItemClick = this._handleClickEvent.bind(this);
			this._keyBoardCallback = this._handleOnKeyboardPress.bind(this);
		}

		/**
		 * Method to set the variables needed on this pattern
		 *
		 * @protected
		 * @memberof SectionIndexItem
		 */
		protected setUpSectionItemIndex(): void {
			if (this.sectionIndexItemTargetId === undefined) {
				this.sectionIndexItemTargetId = this.configs.ScrollToWidgetId;
			}
		}

		/**
		 *  Builds the SectionIndexItem.
		 *
		 * @memberof SectionIndexItem
		 */
		public build(): void {
			super.build();

			this.setUpSectionItemIndex();

			this.setCallbacks();

			this._setUpEvents();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof SectionIndexItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.ScrollToWidgetId:
						// TODO (by CreateNewPattern) Update or Remove
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public dispose(): void {
			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Removes active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public removeActiveElement(): void {
			if (this._selfElem) {
				this._isActive = false;
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.ActiveItem);
			}
		}

		/**
		 * Adds active class from pattern.
		 *
		 * @memberof SectionIndexItem
		 */
		public setActiveElement(): void {
			if (this._selfElem) {
				this._isActive = true;
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.SectionIndex.Enum.CssClass.ActiveItem);
			}
		}
	}
}
