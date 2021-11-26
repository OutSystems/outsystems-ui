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
		// Stores the parent of the item (if it exists)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _accordionParent: OSUIFramework.Patterns.Accordion.IAccordion;
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
		private _onToggleCallback: Callbacks.Generic;
		//Stores the transition end callback function
		private _transitionEnd: Callbacks.Generic;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any, accordion?: Patterns.Accordion.IAccordion) {
			super(uniqueId, new AccordionItemConfig(configs));
			this._accordionParent = accordion;
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
				this._selfElem,
				Constants.AccessibilityAttribute.Aria.Disabled,
				this.configs.IsDisabled
			);
			Helper.Attribute.Set(
				this._selfElem,
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
			if (this._selfElem) {
				Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Expanded, status);
				Helper.Attribute.Set(this._accordionTitle, Constants.AccessibilityAttribute.Aria.Expanded, status);
				Helper.Attribute.Set(this._accordionContent, Constants.AccessibilityAttribute.Aria.Hidden, ariaHidden);
			}
		}

		// Method that gets & stores the HTML elements of the Accordion Item
		private _setUpElements(): void {
			this._accordionTitle = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternTitle);
			this._accordionContent = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternContent);
			this._accordionIcon = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternIcon);
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
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.Open);
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(true, false);
			} else {
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Collapsed);
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.Open);
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(false, true);
			}

			if (this.configs.IsDisabled) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.Disabled);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.Disabled);
			}
		}

		// Method to toggle the collapse and expansion of the AccordionItem
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _toggleAccordion(event?: any): void {
			//If we're not clicking on the title, the icon or the accordion title, we won't open the accordion
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
			} else {
				//If closed, let's open
				this.open();
			}
		}

		private _transitionEndHandler(): void {
			if (this._accordionContent) {
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Animation);

				Helper.Style.SetStyleAttribute(this._accordionContent, 'height', '');
				Helper.Style.SetStyleAttribute(this._accordionTitle, 'pointerEvents', '');

				if (this._accordionContent.style.cssText.length === 0) {
					Helper.Attribute.Remove(this._accordionContent, 'style');
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

		public get isDisabled(): boolean {
			return this.configs.IsDisabled;
		}

		public get isExpanded(): boolean {
			return this.configs.IsExpanded;
		}

		public build(): void {
			super.build();
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

		// This method will open and then close the item to get its final value; then, it will run an animation
		// from the item's inital height to 0
		public close(): void {
			Helper.Attribute.Remove(this._accordionContent, 'style');
			const expandedHeight = this._accordionContent.getBoundingClientRect().height;
			// We know the final height is 0 - it is being collapsed
			const collapsedHeight = 0;

			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Closed);
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.Open);

			Helper.Style.SetStyleAttribute(this._accordionContent, 'height', expandedHeight + GlobalEnum.Units.Pixel);

			// Removes collapsed class and adds the expanded class to animate
			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);
			Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Animation);
				Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);

				Helper.Style.SetStyleAttribute(
					this._accordionContent,
					'height',
					collapsedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);
				// End of animation, item is collapsed
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Collapsed);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this.configs.IsExpanded = false;
			this._setAriaExpanded(false, true);
			this._triggerToggleClick();
		}

		public dispose(): void {
			super.dispose();
			this._removeEvents();
		}

		// This method will open and then close the item to get its final value; then, it will run an animation
		// from 0 to the item's final height
		public open(): void {
			// We know the initial height is 0 - it is  collapsed
			const collapsedHeight = 0;

			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.Closed);
			Helper.Style.AddClass(this._selfElem, Enum.CssClass.Open);

			// While the animation is running, we don't want any clicks happening on the title
			Helper.Style.SetStyleAttribute(this._accordionTitle, 'pointerEvents', 'none');

			Helper.Style.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);
			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);

			Helper.Attribute.Remove(this._accordionTitle, 'style');

			const expandedHeight = this._accordionContent.getBoundingClientRect().height;

			Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);

			Helper.Style.SetStyleAttribute(this._accordionContent, 'height', collapsedHeight + GlobalEnum.Units.Pixel);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Animation);
				Helper.Style.SetStyleAttribute(
					this._accordionContent,
					'height',
					expandedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);

				// End of animation, item is expanded
				Helper.Style.AddClass(this._accordionContent, Enum.CssClass.Expanded);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this.configs.IsExpanded = true;
			this._setAriaExpanded(true, false);
			this._triggerToggleClick();

			if (this._accordionParent) this._accordionParent.triggerAccordionItemClose(this.uniqueId);
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onToggleCallback = callback;
		}
	}
}
