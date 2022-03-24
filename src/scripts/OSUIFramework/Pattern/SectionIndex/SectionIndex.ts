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
	export class SectionIndex
		extends AbstractParent<SectionIndexConfig, SectionIndexItem.ISectionIndexItem>
		implements ISectionIndex
	{
		// Store the current active sectionIndexItem
		private _activeSectionIndexItem: SectionIndexItem.ISectionIndexItem;
		// Store the mainContent reference - The one that will have the scroll
		private _mainScrollContainerElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexConfig(configs));
		}

		// Method to add Item to the list
		private _addSectionIndexItem(childId: string): void {
			// Get the ChildItem reference
			const childItem = OutSystems.OSUI.Patterns.SectionIndexItemAPI.GetSectionIndexItemById(childId);

			if (this.getChild(childId)) {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternsNames.SectionIndexItem} under Id: '${childItem.widgetId}' added to ${GlobalEnum.PatternsNames.SectionIndex} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(childId, childItem);
			}
		}

		// Method to deal with the click at a SectionIndexItem
		private _childItemHasBeenClicked(childId: string): void {
			const childReference = this.getChild(childId);
			// Check if the given ChildId exist as an child item
			if (childReference) {
				// Update child status
				this._updateIsActiveChildItem(childReference);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailChildItemClicked}: The ${GlobalEnum.PatternsNames.SectionIndexItem} under uniqueId: '${childId}' does not exist as an SectionIndexItem from ${GlobalEnum.PatternsNames.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method used to remove a given SectionIndexItem from sectionIndexItems list, it's triggered by SectionIndexItem
		private _removeSectionIndexItem(childId: string): void {
			// Check if the given ChildId exist at childList
			if (this.getChild(childId)) {
				// Remove item
				this.unsetChild(childId);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailUnsetNewChildItem}: The ${GlobalEnum.PatternsNames.SectionIndexItem} under uniqueId: '${childId}' does not exist as an SectionIndexItem from ${GlobalEnum.PatternsNames.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method to set the SectionIndex IsFixed
		private _toggleIsFixed(): void {
			if (this.configs.IsFixed) {
				// Get Header height
				const headerHeight =
					Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.Header).offsetHeight || 0;

				// Get (if exist) the paddingTop value for the mainContent (the one with Scroll)
				const contentPaddingTop =
					window
						.getComputedStyle(Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.MainContent))
						.getPropertyValue(GlobalEnum.CssProperties.PaddingTop) || 0;

				// Set inline css variable that will affect the pattern sticky position top value
				Helper.Dom.Styles.SetStyleAttribute(
					this._selfElem,
					Enum.CssVariable.TopPosition,
					'calc(' + headerHeight + 'px + ' + contentPaddingTop + ')'
				);

				// Set the Sticky class
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsSticky);
			} else {
				// Remove inline added css variable
				Helper.Dom.Styles.RemoveStyleAttribute(this._selfElem, Enum.CssVariable.TopPosition);
				// Remove the Sticky class
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsSticky);
			}
		}

		// Method that will update the IsActive child item status.
		private _updateIsActiveChildItem(child: SectionIndexItem.ISectionIndexItem, isScroll = true): void {
			// Remove old sectionIndexItem as active if exist
			if (this._activeSectionIndexItem) {
				this._activeSectionIndexItem.unsetIsActive();
			}

			// Set new sectionIndexItem as active
			child.setIsActive();

			// Set the current IsActive Child
			this._activeSectionIndexItem = child;

			// Trigger the Scroll navigation
			if (isScroll) {
				Helper.Scroll(
					this._mainScrollContainerElement,
					child.targetElementOffset,
					this.configs.SmoothScrolling
				);
			}
		}

		/**
		 * Method to set the HTMLElements used
		 *
		 * @protected
		 * @memberof SectionIndex
		 */
		protected setHtmlElements(): void {
			this._mainScrollContainerElement = Helper.Dom.ClassSelector(document, GlobalEnum.Screen.Active);
		}

		/**
		 * Method to unset the HTMLElements used
		 *
		 * @protected
		 * @memberof SectionIndex
		 */
		protected unsetHtmlElements(): void {
			this._mainScrollContainerElement = undefined;
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childId Child Item Id to be stored/managed
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof SectionIndex
		 */
		public beNotifiedByChild(childId: string, notifiedTo: Enum.ChildNotifyActionType): void {
			const child = OutSystems.OSUI.Patterns.SectionIndexItemAPI.GetSectionIndexItemById(childId);

			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this._addSectionIndexItem(childId);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._childItemHasBeenClicked(childId);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this._removeSectionIndexItem(childId);
					break;
				case Enum.ChildNotifyActionType.Active:
					this._updateIsActiveChildItem(child, false);
					break;
				case Enum.ChildNotifyActionType.Inactive:
					child.unsetIsActive();
					break;
				default:
					throw new Error(
						`${ErrorCodes.SectionIndex.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
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

			this.setHtmlElements();

			this._toggleIsFixed();

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
						this._toggleIsFixed();
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
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}
	}
}
