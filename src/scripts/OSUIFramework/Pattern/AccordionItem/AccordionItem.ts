// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class AccordionItem extends AbstractPattern<AccordionItemConfig> implements IAccordionItem {
		// Stores the HTML element of the pattern's content
		private _accordionContent: HTMLElement;
		// Stores the HTML element of the pattern's icon
		private _accordionIcon: HTMLElement;
		// Stores the HTML element of the pattern
		private _accordionItem: HTMLElement;
		// Stores the HTML element of the pattern's placeholder
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _accordionPlaceholder: HTMLElement;
		// Stores the HTML element of the pattern's title
		private _accordionTitle: HTMLElement;
		// Store the click event with bind(this)
		private _eventToggleAccordion: Callbacks.Generic;
		//Stores the keyboard callback function
		private _keyBoardCallback: Callbacks.Generic;
		// Callback function to trigger the click event on the platform
		private _onToggleCallback: Callbacks.OSAccordionItemToggleEvent;
		//Stores the transition end callback function
		private _transitionEnd: Callbacks.Generic;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new AccordionItemConfig(configs));
			this._eventToggleAccordion = this._toggleAccordion.bind(this);
			this._transitionEnd = this._transitionEndHandler.bind(this);
			this._keyBoardCallback = this._onKeyboardPress.bind(this);
		}

		// A11y keyboard navigation
		private _onKeyboardPress(event: KeyboardEvent): void {
			//If esc, Close AccordionItem
			if (this.configs.IsExpanded && event.key === GlobalEnum.Keycodes.Escape) {
				this._toggleAccordion();
				event.preventDefault();
				event.stopPropagation();
			}

			//If enter or space use the onAccordionClick to validate
			if (event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space) {
				this._toggleAccordion();
				event.preventDefault();
				event.stopPropagation();
			}
		}

		// Method to be called when the pattern's destruction is required
		private _removeEvents(): void {
			this._accordionTitle.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleAccordion);
			this._accordionTitle.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._keyBoardCallback);
		}

		//Method to apply the static aria attributes
		private _setA11yAttributes(): void {
			Helper.Attribute.Set(
				this._accordionItem,
				Constants.AccessibilityAttribute.Aria.Disabled,
				this.configs.IsDisabled
			);
			Helper.Attribute.Set(
				this._accordionItem,
				Constants.AccessibilityAttribute.Aria.Controls,
				Helper.Attribute.Get(this._accordionPlaceholder, 'id')
			);

			Helper.Attribute.Set(
				this._accordionTitle,
				Constants.AccessibilityAttribute.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Attribute.Set(
				this._accordionTitle,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Button
			);

			Helper.Attribute.Set(this._accordionIcon, Constants.AccessibilityAttribute.Aria.Hidden, true);

			Helper.Attribute.Set(
				this._accordionContent,
				Constants.AccessibilityAttribute.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Attribute.Set(
				this._accordionContent,
				Constants.AccessibilityAttribute.Aria.Labelledby,
				Helper.Attribute.Get(this._accordionTitle, 'id')
			);

			Helper.Attribute.Set(
				this._accordionPlaceholder,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabPanel
			);
		}

		// Method to apply the dynamic aria attributes
		private _setAriaExpanded(status: boolean, ariaHidden: boolean): void {
			if (this._accordionItem) {
				Helper.Attribute.Set(this._accordionItem, Constants.AccessibilityAttribute.Aria.Expanded, status);
				Helper.Attribute.Set(this._accordionTitle, Constants.AccessibilityAttribute.Aria.Expanded, status);
				Helper.Attribute.Set(this._accordionContent, Constants.AccessibilityAttribute.Aria.Hidden, ariaHidden);
			}
		}

		// Method that gets & stores the HTML elements of the Accordion Item
		private _setUpElements(): void {
			this._accordionTitle = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionTitle);
			this._accordionContent = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionContent);
			this._accordionIcon = this._accordionItem.querySelector(Constants.Dot + Enum.CssClass.AccordionIcon);
			this._accordionPlaceholder = this._accordionContent.firstChild as HTMLElement;
		}

		private _setUpEvents(): void {
			if (this.configs.IsDisabled) {
				return;
			}
			this._accordionTitle.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleAccordion);
			this._accordionTitle.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._keyBoardCallback);
		}

		private _setUpInitialState(): void {
			if (this.configs.IsExpanded) {
				Helper.Style.AddClass(this._accordionItem, Enum.CssClass.Open);
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(true, false);
			} else {
				Helper.Style.RemoveClass(this._accordionItem, Enum.CssClass.Open);
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(false, true);
			}

			if (this.configs.IsDisabled) {
				Helper.Style.AddClass(this._accordionItem, Enum.CssClass.Disabled);
			} else {
				Helper.Style.RemoveClass(this._accordionItem, Enum.CssClass.Disabled);
			}
		}

		// Method to toggle the collapse and expansion of the AccordionItem
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _toggleAccordion(event?: any): void {
			//If we're clicking on buttons or links, we won't open the accordion
			if (event) {
				if (
					event.target !== this._accordionTitle &&
					event.target !== this._accordionIcon &&
					event.target !== this._accordionTitle.firstChild
				) {
					return;
				}
			}
			if (this._configs.IsExpanded) {
				//If open, let's close
				this.close();
				this._setAriaExpanded(false, true);
				this._triggerToggleClick();
			} else {
				//If closed, let's open
				this.open();
				this._setAriaExpanded(true, false);
				this._triggerToggleClick();

				// Event to close other submenu instances
				if (this.configs.AccordionParent) this.configs.AccordionParent.triggerAccordionItemClose(this.uniqueId);
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

				this._accordionContent.removeEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._transitionEndHandler,
					false
				);
			}
		}

		// Method that triggers the toggle event on the platform
		private _triggerToggleClick(): void {
			if (this._onToggleCallback) {
				Helper.AsyncInvocation(() => {
					this._onToggleCallback(this.widgetId, this.configs.IsExpanded);
				});
			}
		}

		public get isExpanded(): boolean {
			return this.configs.IsExpanded;
		}

		public build(): void {
			super.build();
			this._accordionItem = this._selfElem;
			this._setUpElements();
			this._setUpInitialState();
			this._setA11yAttributes();
			this._setUpEvents();
			super.finishBuild();
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.IsDisabled:
					this.configs.IsDisabled = propertyValue;
					this._setUpEvents();
					break;
				case Enum.Properties.IsExpanded:
					this.configs.IsExpanded = propertyValue;
					this._toggleAccordion();
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}
		public close(): void {
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

		public dispose(): void {
			super.dispose();
			this._removeEvents();
		}

		public open(): void {
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

		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onToggleCallback = callback;
		}
	}
}
