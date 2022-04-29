/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Accordion extends AbstractParent<AccordionConfig, AccordionItem.IAccordionItem> implements IAccordion {
		private _accordionFirstItem: HTMLElement;
		private _accordionLastItem: HTMLElement;
		private _hasList: boolean;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AccordionConfig(configs));
		}

		// Method to prepare the accordion classes and attributes
		private _prepareAccordion(): void {
			// Check if it's inside a list.
			this._hasList = OutSystems.OSUI.Utils.GetHasListInside(this._selfElem);

			// If there's a list, these will be updated every time a new item enters the DOM
			// Otherwise, it can be done now, as the accordionItem have already been all rendered
			if (this._hasList === false) {
				this.setHTMLElements();

				this._updateFirstAndLastItems();
			}

			this.setA11YProperties();
		}

		/**
		 * Remove classes from first and last accordionItems
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _removeInitialCssClasses(): void {
			if (this._accordionFirstItem) {
				Helper.Dom.Styles.RemoveClass(this._accordionFirstItem, Enum.CssClass.PatternFirstItem);
			}

			if (this._accordionLastItem) {
				Helper.Dom.Styles.RemoveClass(this._accordionLastItem, Enum.CssClass.PatternLastItem);
			}
		}

		/**
		 * Set initial classes to first and last accordionItems
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _setInitialCssClasses(): void {
			if (this._accordionFirstItem) {
				Helper.Dom.Styles.AddClass(this._accordionFirstItem, Enum.CssClass.PatternFirstItem);
			}

			if (this._accordionLastItem) {
				Helper.Dom.Styles.AddClass(this._accordionLastItem, Enum.CssClass.PatternLastItem);
			}
		}

		/**
		 * Method used to recalculate the position of items on the accordion
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _updateFirstAndLastItems(): void {
			// If first item, no need to remove or unset anything
			if (this.childItems.length > 0) {
				// Remove classes form current items
				this._removeInitialCssClasses();
				// Unset those items
				this.unsetHTMLElements();
			}

			// Set new first and last items
			this.setHTMLElements();
			// Set classes to the new first and last items
			this._setInitialCssClasses();
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof Accordion
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleTabList(this._selfElem);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Accordion
		 */
		protected setHTMLElements(): void {
			const targetElem = this._hasList ? this._selfElem.firstChild : this._selfElem;

			this._accordionFirstItem = targetElem.firstChild.firstChild as HTMLElement;
			this._accordionLastItem = targetElem.lastChild.firstChild as HTMLElement;
		}

		/**
		 * Remove references to HTML elements.
		 *
		 * @protected
		 * @memberof Accordion
		 */
		protected unsetHTMLElements(): void {
			this._accordionFirstItem = undefined;
			this._accordionLastItem = undefined;
		}

		/**
		 * Method to add a new accordionItem
		 *
		 * @param {string} uniqueId
		 * @param {AccordionItem.IAccordionItem} accordionItem
		 * @memberof Accordion
		 */
		public addAccordionItem(childId: string): void {
			// Get the ChildItem reference
			const childItem = OutSystems.OSUI.Patterns.AccordionItemAPI.GetAccordionItemById(childId);

			if (this.getChild(childId)) {
				throw new Error(
					`${ErrorCodes.Accordion.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternsNames.AccordionItem} under Id: '${childItem.widgetId}' added to ${GlobalEnum.PatternsNames.Accordion} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(childId, childItem);
			}

			// If we're adding to an accordion w/Multiple Items set to false & this item is expanded,
			// we have to close all the other items
			if (childItem.isOpen) {
				this.triggerAccordionItemClose(childItem.uniqueId);
			}

			// In case the accordion is built, it means we're adding an item dynamically, after it's first setup.
			if (this.isBuilt) {
				//Recalculate positions in the array.
				this._updateFirstAndLastItems();
			}
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childId Child Item Id to be stored/managed
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof SectionIndex
		 */
		public beNotifiedByChild(childId: string, notifiedTo: Enum.ChildNotifyActionType): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this.addAccordionItem(childId);
					break;
				case Enum.ChildNotifyActionType.Click:
					this.triggerAccordionItemClose(childId);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this.removeAccordionItem(childId);
					break;
				default:
					throw new Error(
						`${ErrorCodes.Accordion.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof Accordion
		 */
		public build(): void {
			super.build();

			this._prepareAccordion();

			this.setA11YProperties();

			super.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof Accordion
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.MultipleItems:
						// If we're now not having multiple items, let's collapse everything.
						if (!this.configs.MultipleItems) this.collapseAllItems();
						break;
				}
			}
		}

		/**
		 * Method to close all accordionItems
		 *
		 * @memberof Accordion
		 */
		public collapseAllItems(): void {
			// Filter all items that are open and not disabled
			const itemsToClose = this.childItems.filter((item) => item.isOpen && !item.isDisabled);

			// Close all of them
			itemsToClose.forEach((item) => {
				item.close();
			});
		}

		/**
		 * Method to destroy accordion instance
		 *
		 * @memberof Accordion
		 */
		public dispose(): void {
			this.unsetHTMLElements();
			super.dispose();
		}

		/**
		 * Method to open all accordionItems
		 *
		 * @memberof Accordion
		 */
		public expandAllItems(): void {
			//If this accordion does not have multiple items, it means we can't expand all.
			if (this.configs.MultipleItems) {
				// Filter all items that are open and not disabled
				const itemsToOpen = this.childItems.filter((item) => !item.isOpen && !item.isDisabled);

				// Close all of them
				itemsToOpen.forEach((item) => {
					item.open();
				});
			} else {
				console.warn(
					`${GlobalEnum.PatternsNames.Accordion} (${this.widgetId}): if ${Enum.Properties.MultipleItems} parameter is set to false, this action doesn't work. Set the ${Enum.Properties.MultipleItems} parameter to true.`
				);
			}
		}

		/**
		 * Method to remove an accordionItem
		 *
		 * @param {string} accordionItemId
		 * @memberof Accordion
		 */
		public removeAccordionItem(childId: string): void {
			// Check if the given ChildId exist at childList
			if (this.getChild(childId)) {
				// Remove item
				this.unsetChild(childId);
			} else {
				throw new Error(
					`${ErrorCodes.Accordion.FailUnsetNewChildItem}: The ${GlobalEnum.PatternsNames.AccordionItem} under uniqueId: '${childId}' does not exist as an ${GlobalEnum.PatternsNames.AccordionItem} from ${GlobalEnum.PatternsNames.Accordion} with Id: ${this.widgetId}.`
				);
			}
		}

		/**
		 * Method to close all accordionItems but one
		 *
		 * @param {string} accordionItemId
		 * @return {*}  {void}
		 * @memberof Accordion
		 */
		public triggerAccordionItemClose(childId: string): void {
			//If this accordion has multiple items, it means we don't want to close the other items.
			if (this.configs.MultipleItems) {
				return;
			}

			const childReference = this.getChild(childId);
			// Check if the given ChildId exist as an child item
			if (childReference) {
				// Close all other open items
				this.childItems.forEach((item) => {
					if (item.uniqueId !== childId) {
						if (item.isOpen) {
							item.close();
						}
					}
				});
			} else {
				throw new Error(
					`${ErrorCodes.Accordion.FailChildItemClicked}: The ${GlobalEnum.PatternsNames.AccordionItem} under uniqueId: '${childId}' does not exist as an ${GlobalEnum.PatternsNames.AccordionItem} from ${GlobalEnum.PatternsNames.Accordion} with Id: ${this.widgetId}.`
				);
			}
		}
	}
}
