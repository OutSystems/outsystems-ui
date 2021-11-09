// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class AccordionItem extends AbstractPattern<AccordionItemConfig> implements IAccordionItem {
		// Stores the accordion item's parent, if it exists
		private _accordion: HTMLElement;
		// Stores the HTML element of the pattern's content
		private _accordionContent: HTMLElement;
		// Stores the HTML element of the pattern's icon
		private _accordionIcon: HTMLElement;
		// Stores the HTML element of the pattern
		private _accordionItem: HTMLElement;
		// Stores the HTML element of the pattern's placeholder
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _accordionPlaceholder: any;
		// Stores the HTML element of the pattern's title
		private _accordionTitle: HTMLElement;
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventToggleClick: any;
		// Boolean to check if the accordion item has content
		private _hasContent: boolean;
		// Boolean to check if the accordion item has a wrapper
		private _hasParent: boolean;
		// Callback function to trigger the click event on the platform
		private _onToogleClick: Callbacks.OSAccordionItemToggleEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new AccordionItemConfig(configs));

			this._hasParent = false;
			this._eventToggleClick = this._toggleAccordion.bind(this);
		}

		private _collapse(): void {
			Helper.Style.RemoveClass(this._accordionItem, 'is--open');
			Helper.Style.RemoveClass(this._accordionContent, 'is--expanded');
			Helper.Style.AddClass(this._accordionItem, 'is--closed');
			Helper.Style.AddClass(this._accordionContent, 'is--collapsed');
			this.configs.IsExpanded = false;
		}

		private _checkIfInsideAccordion(): void {
			this._accordion = this._accordionItem.closest(Enum.CssClass.Accordion);

			// If accordion selector with closest returns null, change to work with parent nodes
			if (this._accordion === null) {
				//this._accordion = sectionItem.parentNode.parentNode;
			}

			// Check if is inside Accordion
			//if (this._accordion.classList.contains(Enum.CssClass.Accordion)) {
			//	this._hasParent = true;
			//}
		}

		private _expand(): void {
			Helper.Style.RemoveClass(this._accordionItem, 'is--closed');
			Helper.Style.RemoveClass(this._accordionContent, 'is--collapsed');
			Helper.Style.AddClass(this._accordionItem, 'is--open');
			Helper.Style.AddClass(this._accordionContent, 'is--expanded');
			this.configs.IsExpanded = true;
		}

		// Method that gets & stores the HTML elements of the Accordion Item
		private _setUpElements(): void {
			this._accordionTitle = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionTitle);
			this._accordionContent = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionContent);
			this._accordionIcon = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionIcon);
			this._accordionPlaceholder = this._accordionContent.firstChild;
		}

		private _setUpEvents(): void {
			if (this.configs.IsDisabled) {
				return;
			}
			this._accordionTitle.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
		}
		// Method to toggle the collapse and expansion of the AccordionItem
		private _toggleAccordion() {
			if (this._configs.IsExpanded) {
				//If open, let's close
				this._collapse();
			} else {
				//If closed, let's open
				this._expand();
			}
		}

		// Method that triggers the toggle event on the platform
		private _triggerToggleClick(): void {
			if (this._onToogleClick) {
				Helper.AsyncInvocation(() => {
					this._onToogleClick(this.widgetId, this.configs.IsExpanded);
				});
			}
		}

		public build(): void {
			super.build();
			this._accordionItem = this._selfElem;
			this._checkIfInsideAccordion();
			this._setUpElements();
			this._setUpEvents();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}
	}
}
