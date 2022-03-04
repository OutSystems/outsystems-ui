// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex {
	/**
	 *  Class that implements the SectionIndex pattern.
	 *
	 * @export
	 * @class SectionIndex
	 * @extends {AbstractPattern<SectionIndexConfig, SectionIndexItem.ISectionIndexItem>}
	 * @implements {ISectionIndex}
	 */
	export class SectionIndex<C extends SectionIndexConfig>
		extends AbstractParent<SectionIndexConfig, SectionIndexItem.ISectionIndexItem>
		implements ISectionIndex
	{
		// Store the current sectionIndexItem active
		private _activeSectionIndexItem: SectionIndexItem.ISectionIndexItem;
		// Store the content padding
		private _contentPaddingTop: number;
		// Store the header height
		private _headerHeight: number;
		// Store flag that shows if we are leading with a browser that needs polyfill
		private _isUnsupportedBrowser: boolean;
		// Store the distance between the window top and the content
		private _offset: number;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		/**
		 * Method to add Item to the list
		 *
		 * @param {string} uniqueId
		 * @param {SectionIndexItem.ISectionIndexItem} sectionIndexItem
		 * @memberof SectionIndex
		 */
		private _addSectionIndexItem(optionItemId: string): void {
			// Get the DropdownOptionItem reference
			const optionItem = OutSystems.OSUI.Patterns.SectionIndexItemAPI.GetSectionIndexItemById(optionItemId);

			if (this.getChild(optionItemId)) {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailSetNewOptionItem}: There is already a ${GlobalEnum.PatternsNames.SectionIndexItem} under Id: '${optionItem.widgetId}' added to ${GlobalEnum.PatternsNames.SectionIndex} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store DropDownOption Item
				this.setChild(optionItemId, optionItem);
			}
			// In case the accordion is built, it means we're adding an item dynamically, after it's first setup.
			if (this.isBuilt) {
				//Recalculate positions in the array.
				this._setUpSectionIndex();
			}
		}

		// Method to deal with the click at a DropdpownOptionItem
		private _optionItemHasBeenClicked(optionItemId: string): void {
			const childReference = this.getChild(optionItemId);
			// Check if the given OptionId exist at optionsList
			if (childReference) {
				// Check if Dropdown must close!
				this.setActiveElement(childReference);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailOptionItemClicked}: The ${GlobalEnum.PatternsNames.SectionIndexItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternsNames.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method used to remove a given SectionIndexItem from optionItems list, it's triggered by SectionIndexItem
		private _removeSectionIndexItem(optionItemId: string): void {
			// Check if the given OptionId exist at optionsList
			if (this.getChild(optionItemId)) {
				// Remove item
				this.unsetChild(optionItemId);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailUnsetNewOptionItem}: The ${GlobalEnum.PatternsNames.SectionIndexItem} under uniqueId: '${optionItemId}' does not exist as an OptionItem from ${GlobalEnum.PatternsNames.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		/**
		 * Method to set the SectionIndex IsFixed
		 *
		 * @private
		 * @memberof SectionIndex
		 */
		private _setIsFixed(): void {
			if (this.configs.IsFixed) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.UsefulSticky);
				this._selfElem.style.setProperty('--top-position', this._offset + 'px');
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.UsefulSticky);
			}
		}

		/**
		 * Method used to recalculate the position of items on the sectionIndex
		 *
		 * @memberof SectionIndex
		 */
		private _setUpSectionIndex(): void {
			const Header = Helper.Dom.ClassSelector(document, 'header');

			this._contentPaddingTop = parseInt(
				window
					.getComputedStyle(Helper.Dom.ClassSelector(document, 'main-content'))
					.getPropertyValue('padding-top')
			);
			if (Header) {
				this._headerHeight = Header.offsetHeight;
			} else {
				this._headerHeight = 0;
			}

			this._offset = this._headerHeight + this._contentPaddingTop;

			this._setIsFixed();

			this._isUnsupportedBrowser = Helper.Dom.Styles.ContainsClass(document.body, GlobalEnum.Browser.safari);

			// Check for browsers that don't support ScrollIntoView to call Polyfill
			if (this.configs.SmoothScrolling && this._isUnsupportedBrowser) {
				//callPolyfill();
			}
		}

		/**
		 * Method used to be notified by a given dropdownOptionId about a given action and act accordingly
		 *
		 * @param childId Dropdown Option Item Id to be stored
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof OSUIDropdownServerSide
		 */
		public beNotifiedByChild(childId: string, notifiedTo: Enum.ChildNotifyActionType): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this._addSectionIndexItem(childId);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._optionItemHasBeenClicked(childId);
					break;
				case Enum.ChildNotifyActionType.KeyPressed:
					//this._optionItemKeyPressed(childId);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this._removeSectionIndexItem(childId);
					break;
				default:
					throw new Error(
						`${ErrorCodes.SectionIndex.FailToSetOptionItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
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

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof OSUIDropdownServerSide
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validation(isValid: boolean, validationMessage: string): void {
			throw new Error(
				`${ErrorCodes.SectionIndex.HasNoImplementation.code}:	${ErrorCodes.SectionIndex.HasNoImplementation.message}`
			);
		}
	}
}
