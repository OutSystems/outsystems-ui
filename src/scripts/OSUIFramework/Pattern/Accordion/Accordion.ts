/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Accordion extends AbstractPattern<AccordionConfig> implements IAccordion {
		private _accordionFirstItem: HTMLElement;
		// Stores the Accordion Items of this Accordion
		private _accordionItems: Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>;
		private _accordionLastItem: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AccordionConfig(configs));
			this._accordionItems = new Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>();
		}

		/**
		 * Remove classes from first and last accordionItems
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _removeInitialCssClasses(): void {
			Helper.Dom.Styles.RemoveClass(this._accordionFirstItem, Enum.CssClass.PatternFirstItem);
			Helper.Dom.Styles.RemoveClass(this._accordionLastItem, Enum.CssClass.PatternLastItem);
		}

		/**
		 * Set initial classes to first and last accordionItems
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _setInitialCssClasses(): void {
			Helper.Dom.Styles.AddClass(this._accordionFirstItem, Enum.CssClass.PatternFirstItem);
			Helper.Dom.Styles.AddClass(this._accordionLastItem, Enum.CssClass.PatternLastItem);
		}

		/**
		 * Method used to recalculate the position of items on the accordion
		 *
		 * @private
		 * @memberof Accordion
		 */
		private _updateFirstAndLastItems(): void {
			// Remove classes form current items
			this._removeInitialCssClasses();
			// Unset those items
			this.unsetHTMLElements();
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
			// Accordion > OSBlockWidget(Accordion Item) > AccordionItem
			this._accordionFirstItem = this._selfElem.firstChild.firstChild as HTMLElement;
			this._accordionLastItem = this._selfElem.lastChild.firstChild as HTMLElement;
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
		public addAccordionItem(uniqueId: string, accordionItem: AccordionItem.IAccordionItem): void {
			this._accordionItems.set(uniqueId, accordionItem);

			// If we're adding to an accordion w/Multiple Items set to false & this item is expanded,
			// we have to close all the other items
			if (accordionItem.isExpanded) {
				this.triggerAccordionItemClose(accordionItem.uniqueId);
			}

			// In case the accordion is built, it means we're adding an item dynamically, after it's first setup.
			if (this.isBuilt) {
				//Recalculate positions in the array.
				this._updateFirstAndLastItems();
			}
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof Accordion
		 */
		public build(): void {
			super.build();

			this.setHTMLElements();
			this._updateFirstAndLastItems();
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
			this._accordionItems.forEach((item) => {
				if (item.isExpanded && !item.isDisabled) {
					item.close();
				}
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
				this._accordionItems.forEach((item) => {
					if (!item.isExpanded && !item.isDisabled) {
						item.open();
					}
				});
			}
		}

		/**
		 * Method to remove an accordionItem
		 *
		 * @param {string} accordionItemId
		 * @memberof Accordion
		 */
		public removeAccordionItem(accordionItemId: string): void {
			this._accordionItems.delete(accordionItemId);
		}

		/**
		 * Method to close all accordionItems but one
		 *
		 * @param {string} accordionItemId
		 * @return {*}  {void}
		 * @memberof Accordion
		 */
		public triggerAccordionItemClose(accordionItemId: string): void {
			//If this accordion has multiple items, it means we don't want to close the other items.
			if (this.configs.MultipleItems) {
				return;
			}

			this._accordionItems.forEach((item) => {
				if (item.uniqueId !== accordionItemId) {
					if (item.isExpanded) {
						item.close();
					}
				}
			});
		}
	}
}
