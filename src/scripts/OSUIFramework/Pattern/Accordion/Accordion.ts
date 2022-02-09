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

		// Method used to recalculate the position of items on the accordion
		private _setUpAccordion(): void {
			// Accordion > OSBlockWidget(Accordion Item) > AccordionItem
			let firstAccordionItem = this._selfElem.firstChild.firstChild as HTMLElement;
			let lastAccordionItem = this._selfElem.lastChild.firstChild as HTMLElement;

			if (firstAccordionItem) Helper.Dom.Styles.RemoveClass(firstAccordionItem, Enum.CssClass.PatternFirstItem);
			if (lastAccordionItem) Helper.Dom.Styles.RemoveClass(lastAccordionItem, Enum.CssClass.PatternLastItem);

			// Accordion > OSBlockWidget(Accordion Item) > AccordionItem
			firstAccordionItem = this._selfElem.firstChild.firstChild as HTMLElement;
			lastAccordionItem = this._selfElem.lastChild.firstChild as HTMLElement;

			Helper.Dom.Styles.AddClass(firstAccordionItem, Enum.CssClass.PatternFirstItem);
			Helper.Dom.Styles.AddClass(lastAccordionItem, Enum.CssClass.PatternLastItem);
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
				this._setUpAccordion();
			}
		}

		public build(): void {
			super.build();

			this._setUpAccordion();
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

		public collapseAllItems(): void {
			this._accordionItems.forEach((item) => {
				if (item.isExpanded && !item.isDisabled) {
					item.close();
				}
			});
		}

		public dispose(): void {
			super.dispose();
		}

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

		public removeAccordionItem(accordionItemId: string): void {
			this._accordionItems.delete(accordionItemId);
		}

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
