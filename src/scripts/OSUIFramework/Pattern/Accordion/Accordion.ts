/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Accordion {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Accordion extends AbstractPattern<AccordionConfig> implements IAccordion {
		// Stores the Accordion Items of this Accordion
		private _accordionItems: Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AccordionConfig(configs));
			this._accordionItems = new Map<string, OSUIFramework.Patterns.AccordionItem.IAccordionItem>();
		}

		// Method used to recalculate the position of items on the accordion
		private _setUpAccordion(): void {
			// Accordion > OSBlockWidget(Accordion Item) > AccordionItem
			let firstAccordionItem = this._selfElem.firstChild.firstChild as HTMLElement;
			let lastAccordionItem = this._selfElem.lastChild.firstChild as HTMLElement;

			if (firstAccordionItem) Helper.Style.RemoveClass(firstAccordionItem, Enum.CssClass.FirstItem);
			if (lastAccordionItem) Helper.Style.RemoveClass(lastAccordionItem, Enum.CssClass.LastItem);

			// Accordion > OSBlockWidget(Accordion Item) > AccordionItem
			firstAccordionItem = this._selfElem.firstChild.firstChild as HTMLElement;
			lastAccordionItem = this._selfElem.lastChild.firstChild as HTMLElement;

			Helper.Style.AddClass(firstAccordionItem, Enum.CssClass.FirstItem);
			Helper.Style.AddClass(lastAccordionItem, Enum.CssClass.LastItem);
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
