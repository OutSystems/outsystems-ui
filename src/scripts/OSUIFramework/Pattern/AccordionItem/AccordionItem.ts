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
		//Stores the transition end callback function
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _transitionEnd: any;
		// Stores the wait DOM transition function to use on a timeout
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
		private _waitDOM: any;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new AccordionItemConfig(configs));

			this._hasParent = false;
			this._eventToggleClick = this._toggleAccordion.bind(this);
			this._transitionEnd = this._transitionEndHandler.bind(this);
			this._waitDOM = this._waitDomIterateTimeout.bind(this);
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

		private _collapse(): void {
			this._accordionContent.removeAttribute('style');

			// Gets initial height value
			const expandedHeight = this._accordionContent.getBoundingClientRect().height;

			// Toggle is--closed/is--open class from current accordion item
			Helper.Style.AddClass(this._accordionItem, Enum.CssClass.Closed);
			Helper.Style.RemoveClass(this._accordionItem, Enum.CssClass.Open);

			// Removes expanded class and adds the collapsed class to obtain the collapsed height value
			Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);
			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Collapsed);

			const collapsedHeight = this._accordionContent.getBoundingClientRect().height;

			this._accordionContent.style.height = expandedHeight + GlobalEnum.Units.Pixel;

			// Removes collapsed class and adds the expanded class to animate
			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);
			Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);

			// This setTimeout (0ms) will ensure that the DOM received the height 0 before actually starts the transition
			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Animation);

				// Removes is--expanded class from current accordion item content
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);

				this._accordionContent.style.height = collapsedHeight + GlobalEnum.Units.Pixel;

				// Adds event listener to transition end
				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);

				// Adds is--collapsed class to current accordion item content
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Collapsed);

				// Clear timeout
				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this.configs.IsExpanded = false;
		}

		private _expand(): void {
			const collapsedHeight = this._accordionContent.getBoundingClientRect().height;

			Helper.Style.RemoveClass(this._accordionItem, Enum.CssClass.Closed);
			Helper.Style.AddClass(this._accordionItem, Enum.CssClass.Open);

			// While the animation is running, we don't want any clicks happening on the title
			this._accordionTitle.style.pointerEvents = 'none';

			Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);
			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);

			this._accordionTitle.removeAttribute('style');

			// Gets final height value
			const expandedHeight = this._accordionContent.getBoundingClientRect().height;

			// Removes is--expanded class from current accordion item content to animate
			this._accordionContent.classList.remove(Enum.CssClass.Expanded);

			this._accordionContent.style.height = collapsedHeight + GlobalEnum.Units.Pixel;

			// This setTimeout (0ms) will ensure that the DOM received the height 0 before actually starts the transition
			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				this._accordionContent.classList.add(Enum.CssClass.Animation);

				this._accordionContent.style.height = expandedHeight + GlobalEnum.Units.Pixel;

				// Adds event listener to transition end
				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);

				// Adds is--expanded class to current accordion item content
				this._accordionContent.classList.add(Enum.CssClass.Expanded);

				// Clear timeout
				clearTimeout(waitDomIterateTimeout);
			}, 100);

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

		private _setUpInitialState(): void {
			if (this.configs.IsExpanded) {
				Helper.Style.AddClass(this._accordionItem, Enum.CssClass.Open);
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);
				//data-expanded
			} else {
				Helper.Style.RemoveClass(this._accordionItem, Enum.CssClass.Open);
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);
			}
		}

		// Method to toggle the collapse and expansion of the AccordionItem
		private _toggleAccordion(): void {
			if (this._configs.IsExpanded) {
				//If open, let's close
				this._collapse();
			} else {
				//If closed, let's open
				this._expand();
			}
		}

		private _transitionEndHandler(): void {
			if (this._accordionContent) {
				this._accordionContent.classList.remove(Enum.CssClass.Animation);
				this._accordionContent.style.height = '';
				this._accordionTitle.style.pointerEvents = '';

				if (this._accordionContent.style.cssText.length === 0) {
					this._accordionContent.removeAttribute('style');
				}

				/*if($parameters.IsKeypress) {
					// Add focus for Accessibility
					currentElement.focus();
				}
				
				// Set visibility through ARIA states - Accessibility
				$actions.SetAriaAttributes(true, $parameters.WidgetId);*/

				this._accordionContent.removeEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._transitionEndHandler,
					false
				);
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

		private _waitDomIterateTimeout(height: number): void {
			// Adds is--animating class to current accordion item content to obtain the final height value
			this._accordionContent.classList.add(Enum.CssClass.Animation);

			this._accordionContent.style.height = height + GlobalEnum.Units.Pixel;

			// Adds event listener to transition end
			this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEndHandler);

			// Adds is--expanded class to current accordion item content
			this._accordionContent.classList.add(Enum.CssClass.Expanded);

			// Clear timeout
			clearTimeout(this._waitDOM);
		}

		public build(): void {
			super.build();
			this._accordionItem = this._selfElem;
			this._checkIfInsideAccordion();
			this._setUpElements();
			this._setUpInitialState();
			this._setUpEvents();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}
	}
}
