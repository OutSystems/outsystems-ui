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
		}

		// A11y keyboard navigation
		private _onKeyboardPress(event: KeyboardEvent): void {
			//If esc, Close AccordionItem
			if (this.configs.IsExpanded && event.key === GlobalEnum.Keycodes.Escape) {
				this._toggleAccordion(this.configs.IsExpanded);
				event.preventDefault();
				event.stopPropagation();
			}

			//If enter or space use the onAccordionClick to validate
			if (event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space) {
				this._toggleAccordion(this.configs.IsExpanded);
				event.preventDefault();
				event.stopPropagation();
			}
		}

		// Method to be called when the pattern's destruction is required
		private _removeEvents(): void {
			this._accordionTitle.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleAccordion);
			this._accordionTitle.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._keyBoardCallback);
		}

		// Method to apply the dynamic aria attributes
		private _setAriaExpanded(status: boolean, ariaHidden: boolean): void {
			if (this._selfElem) {
				Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Expanded, status);
				Helper.Dom.Attribute.Set(this._accordionTitle, Constants.A11YAttributes.Aria.Expanded, status);
				Helper.Dom.Attribute.Set(this._accordionContent, Constants.A11YAttributes.Aria.Hidden, ariaHidden);
			}
		}

		private _setUpDisabledState(): void {
			if (this.configs.IsDisabled) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Disabled);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Disabled);
			}
		}

		private _setUpEvents(): void {
			if (this.configs.IsDisabled) {
				this._removeEvents();
				return;
			}
			this._accordionTitle.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleAccordion);
			this._accordionTitle.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._keyBoardCallback);
		}

		// Method to toggle the collapse and expansion of the AccordionItem
		// This method is to be used by the state of the Accordion & the ChangeProperty method
		private _toggleAccordion(isExpanded: boolean): void {
			if (isExpanded) {
				//If open, let's close
				this.close();
			} else {
				//If closed, let's open
				this.open();
			}
		}

		//This method below is used ONLY for checking if the event is cliked on the correct html element
		private _toggleAccordionEvent(event?: MouseEvent): void {
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

			this._toggleAccordion(this.configs.IsExpanded);
		}

		private _transitionEndHandler(): void {
			if (this._accordionContent) {
				Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Animation);

				Helper.Dom.Styles.SetStyleAttribute(this._accordionContent, GlobalEnum.InlineStyle.Height, '');
				Helper.Dom.Styles.SetStyleAttribute(this._accordionTitle, GlobalEnum.InlineStyle.PointerEvents, '');

				if (this._accordionContent.style.cssText.length === 0) {
					Helper.Dom.Attribute.Remove(this._accordionContent, GlobalEnum.HTMLAttributes.Style);
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
			Helper.AsyncInvocation(this._onToggleCallback, this.widgetId, this.configs.IsExpanded);
		}

		//Method to apply the static aria attributes
		protected setA11yProperties(): void {
			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Disabled, this.configs.IsDisabled);
			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Aria.Controls,
				Helper.Dom.Attribute.Get(this._accordionPlaceholder, GlobalEnum.HTMLAttributes.Id)
			);

			Helper.Dom.Attribute.Set(this._selfElem, 'role', Constants.A11YAttributes.Role.Tab);

			Helper.Dom.Attribute.Set(
				this._accordionTitle,
				Constants.A11YAttributes.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Dom.Attribute.Set(
				this._accordionTitle,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Button
			);

			Helper.Dom.Attribute.Set(this._accordionIcon, Constants.A11YAttributes.Aria.Hidden, true);

			Helper.Dom.Attribute.Set(
				this._accordionContent,
				Constants.A11YAttributes.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Dom.Attribute.Set(
				this._accordionContent,
				Constants.A11YAttributes.Aria.Labelledby,
				Helper.Dom.Attribute.Get(this._accordionTitle, GlobalEnum.HTMLAttributes.Id)
			);

			Helper.Dom.Attribute.Set(
				this._accordionPlaceholder,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabPanel
			);
		}

		protected setCallbacks(): void {
			this._eventToggleAccordion = this._toggleAccordionEvent.bind(this);
			this._transitionEnd = this._transitionEndHandler.bind(this);
			this._keyBoardCallback = this._onKeyboardPress.bind(this);
		}

		// Method that gets & stores the HTML elements of the Accordion Item
		protected setHtmlElements(): void {
			this._accordionTitle = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTitle);
			this._accordionContent = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._accordionIcon = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternIcon);
			this._accordionPlaceholder = this._accordionContent.firstChild as HTMLElement;
		}

		protected setInitialStates(): void {
			if (this.configs.IsExpanded) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Open);
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(true, false);
			} else {
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Collapsed);
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Open);
				Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);
				this._setAriaExpanded(false, true);
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
			this.setHtmlElements();
			this.setInitialStates();
			this._setUpDisabledState();
			this.setA11yProperties();
			this.setCallbacks();
			this._setUpEvents();
			super.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			const expandedState = this.configs.IsExpanded;
			super.changeProperty(propertyName, propertyValue);
			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsDisabled:
						this._setUpDisabledState();
						this._setUpEvents();
						break;
					case Enum.Properties.IsExpanded:
						this._toggleAccordion(expandedState);
						break;
				}
			}
		}

		// This method will open and then close the item to get its final value; then, it will run an animation
		// from the item's inital height to 0
		public close(): void {
			Helper.Dom.Attribute.Remove(this._accordionContent, GlobalEnum.HTMLAttributes.Style);
			const expandedHeight = this._accordionContent.getBoundingClientRect().height;
			// We know the final height is 0 - it is being collapsed
			const collapsedHeight = 0;

			Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Closed);
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Open);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionContent,
				GlobalEnum.InlineStyle.Height,
				expandedHeight + GlobalEnum.Units.Pixel
			);

			// Removes collapsed class and adds the expanded class to animate
			Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Expanded);
			Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Animation);
				Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);

				Helper.Dom.Styles.SetStyleAttribute(
					this._accordionContent,
					GlobalEnum.InlineStyle.Height,
					collapsedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);
				// End of animation, item is collapsed
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Collapsed);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this.configs.IsExpanded = false;
			this._setAriaExpanded(false, true);
			this._triggerToggleClick();
		}

		public dispose(): void {
			this._removeEvents();
			this._accordionParent?.removeAccordionItem(this.uniqueId);
			super.dispose();
		}

		// This method will open and then close the item to get its final value; then, it will run an animation
		// from 0 to the item's final height
		public open(): void {
			// We know the initial height is 0 - it is  collapsed
			const collapsedHeight = 0;

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Closed);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Open);

			// While the animation is running, we don't want any clicks happening on the title
			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionTitle,
				GlobalEnum.InlineStyle.PointerEvents,
				GlobalEnum.CssProperties.None
			);

			Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Collapsed);
			Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Expanded);

			Helper.Dom.Attribute.Remove(this._accordionTitle, GlobalEnum.HTMLAttributes.Style);

			const expandedHeight = this._accordionContent.getBoundingClientRect().height;

			Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Collapsed);
			Helper.Dom.Styles.RemoveClass(this._accordionContent, Enum.CssClass.Expanded);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionContent,
				GlobalEnum.InlineStyle.Height,
				collapsedHeight + GlobalEnum.Units.Pixel
			);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Animation);
				Helper.Dom.Styles.SetStyleAttribute(
					this._accordionContent,
					GlobalEnum.InlineStyle.Height,
					expandedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionContent.addEventListener(GlobalEnum.HTMLEvent.TransitionEnd, this._transitionEnd);

				// End of animation, item is expanded
				Helper.Dom.Styles.AddClass(this._accordionContent, Enum.CssClass.Expanded);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this.configs.IsExpanded = true;
			this._setAriaExpanded(true, false);
			this._triggerToggleClick();

			if (this._accordionParent) this._accordionParent.triggerAccordionItemClose(this.uniqueId);
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			if (this._onToggleCallback === undefined) {
				this._onToggleCallback = callback;
			}
		}
	}
}
