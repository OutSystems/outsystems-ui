/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Accordion extends AbstractPattern<AccordionConfig> implements IAccordion {
		// Stores the Accordion Items of this Accordion
		private _accordionItems: Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>;
		//Stores the order in which the items are in the accordion
		private _accordionItemsHTML: Array<HTMLElement>;
		private _accordionItemsOrder: Array<string>;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AccordionConfig(configs));
			this._accordionItems = new Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>();
			this._accordionItemsOrder = [];
		}
		// Method used to recalculate the position of items on the accordion
		private _recalculateItemOrder(): void {
			this._accordionItemsOrder = [];
			this._accordionItemsHTML.forEach((item) => {
				if (this._accordionItems.has(item.getAttribute('name')))
					this._accordionItemsOrder.push(item.getAttribute('name'));
			});

			this._accordionItemsOrder.forEach((name, index) => {
				const AccordionItem = this._accordionItems.get(name);
				if (AccordionItem) {
					AccordionItem.removeItemAsFirstItem();
					AccordionItem.removeItemAsLastItem();
				}
			});
			const firstAccordionItem = this._accordionItems.get(this._accordionItemsOrder[0]);
			const lastAccordionItem = this._accordionItems.get(
				this._accordionItemsOrder[this._accordionItemsOrder.length - 1]
			);
			if (firstAccordionItem) firstAccordionItem.setItemAsFirstItem();
			if (lastAccordionItem) lastAccordionItem.setItemAsLastItem();
		}

		private _setUpAccordion(): void {
			this._accordionItemsHTML = <HTMLElement[]>[
				...this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClass.PatternItem),
			];
			this._recalculateItemOrder();
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
			super.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.MultipleItems:
					this.configs.MultipleItems = propertyValue;
					// If we're now not having multiple items, let's collapse everything.
					if (!this.configs.MultipleItems) this.collapseAllItems();
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
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
