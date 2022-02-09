// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class AccordionItem extends AbstractPattern<AccordionItemConfig> implements IAccordionItem {
		// Stores the HTML element of the pattern's content
		private _accordionItemContentElem: HTMLElement;
		// Stores the HTML element of the pattern's icon
		private _accordionItemIconElem: HTMLElement;
		// Stores the HTML element of the pattern's placeholder
		private _accordionItemPlaceholder: HTMLElement;
		// Stores the HTML element of the pattern's title
		private _accordionItemTitleElem: HTMLElement;
		// Stores the parent of the item (if it exists)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _accordionParentElem: OSUIFramework.Patterns.Accordion.IAccordion;
		// Store the click event with bind(this)
		private _eventOnClick: Callbacks.Generic;
		//Stores the transition end callback function
		private _eventOnTransitionEnd: Callbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyPress: Callbacks.Generic;
		private _isOpen: boolean;
		// Callback function to trigger the click event on the platform
		private _platformEventOnToggle: Callbacks.Generic;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any, accordion?: Patterns.Accordion.IAccordion) {
			super(uniqueId, new AccordionItemConfig(configs));
			this._accordionParentElem = accordion;
			this._isOpen = this.configs.StartsExpanded;
		}

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @param {MouseEvent} [event]
		 * @return {*}  {void}
		 * @memberof AccordionItem
		 */
		private _accordionOnClickHandler(event?: MouseEvent): void {
			//If we're not clicking on the title, the icon or the accordion title, we won't open the accordion
			if (
				event?.target !== this._accordionItemTitleElem &&
				event?.target !== this._accordionItemIconElem &&
				event?.target !== this._accordionItemTitleElem.firstChild
			) {
				return;
			}

			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		// A11y keyboard navigation
		private _onKeyboardPress(event: KeyboardEvent): void {
			//If esc, Close AccordionItem
			if (this._isOpen && event.key === GlobalEnum.Keycodes.Escape) {
				this.close();
				event.preventDefault();
				event.stopPropagation();
			}

			//If enter or space use the onAccordionClick to validate
			if (event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space) {
				this.open();
				event.preventDefault();
				event.stopPropagation();
			}
		}

		/**
		 * Mthod that triggers the toggle event on the platform
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _onToggleCallback(): void {
			Helper.AsyncInvocation(this._platformEventOnToggle, this.widgetId, this._isOpen);
		}

		// Method to apply the dynamic aria attributes
		private _setAriaExpanded(status: boolean, ariaHidden: boolean): void {
			if (this._selfElem) {
				Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Expanded, status);
				Helper.Dom.Attribute.Set(this._accordionItemTitleElem, Constants.A11YAttributes.Aria.Expanded, status);
				Helper.Dom.Attribute.Set(
					this._accordionItemContentElem,
					Constants.A11YAttributes.Aria.Hidden,
					ariaHidden
				);
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
				this.unsetCallbacks();
				return;
			}
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);
		}

		private _transitionEndHandler(): void {
			if (this._accordionItemContentElem) {
				Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Animation);

				Helper.Dom.Styles.SetStyleAttribute(this._accordionItemContentElem, GlobalEnum.InlineStyle.Height, '');
				Helper.Dom.Styles.SetStyleAttribute(
					this._accordionItemTitleElem,
					GlobalEnum.InlineStyle.PointerEvents,
					''
				);

				if (this._accordionItemContentElem.style.cssText.length === 0) {
					Helper.Dom.Attribute.Remove(this._accordionItemContentElem, GlobalEnum.HTMLAttributes.Style);
				}

				this._accordionItemContentElem.removeEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._transitionEndHandler,
					false
				);
			}
		}

		//Method to apply the static aria attributes
		protected setA11yProperties(): void {
			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Disabled, this.configs.IsDisabled);
			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Aria.Controls,
				Helper.Dom.Attribute.Get(this._accordionItemPlaceholder, GlobalEnum.HTMLAttributes.Id)
			);

			Helper.Dom.Attribute.Set(this._selfElem, 'role', Constants.A11YAttributes.Role.Tab);

			Helper.Dom.Attribute.Set(
				this._accordionItemTitleElem,
				Constants.A11YAttributes.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Dom.Attribute.Set(
				this._accordionItemTitleElem,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Button
			);

			Helper.Dom.Attribute.Set(this._accordionItemIconElem, Constants.A11YAttributes.Aria.Hidden, true);

			Helper.Dom.Attribute.Set(
				this._accordionItemContentElem,
				Constants.A11YAttributes.TabIndex,
				this.configs.IsDisabled ? '-1' : '0'
			);
			Helper.Dom.Attribute.Set(
				this._accordionItemContentElem,
				Constants.A11YAttributes.Aria.Labelledby,
				Helper.Dom.Attribute.Get(this._accordionItemTitleElem, GlobalEnum.HTMLAttributes.Id)
			);

			Helper.Dom.Attribute.Set(
				this._accordionItemPlaceholder,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabPanel
			);
		}

		protected setCallbacks(): void {
			this._eventOnClick = this._accordionOnClickHandler.bind(this);
			this._eventOnTransitionEnd = this._transitionEndHandler.bind(this);
			this._eventOnkeyPress = this._onKeyboardPress.bind(this);
		}

		// Method that gets & stores the HTML elements of the Accordion Item
		protected setHtmlElements(): void {
			this._accordionItemTitleElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTitle);
			this._accordionItemContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._accordionItemIconElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternIcon);
			this._accordionItemPlaceholder = this._accordionItemContentElem.firstChild as HTMLElement;
		}

		protected setInitialStates(): void {
			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.Open);
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Expanded);
				this._setAriaExpanded(true, false);
			} else {
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Collapsed);
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Open);
				Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Expanded);
				this._setAriaExpanded(false, true);
			}
		}

		/**
		 * Method to remove the event listeners and unset callbacks
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected unsetCallbacks(): void {
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);

			this._eventOnClick = undefined;
			this._eventOnTransitionEnd = undefined;
			this._eventOnkeyPress = undefined;
		}

		/**
		 * Method to unset the html elements
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected unsetHtmlElements(): void {
			this._accordionItemTitleElem = undefined;
			this._accordionItemContentElem = undefined;
			this._accordionItemIconElem = undefined;
			this._accordionItemPlaceholder = undefined;
		}

		public get isDisabled(): boolean {
			return this.configs.IsDisabled;
		}

		public get isExpanded(): boolean {
			return this._isOpen;
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof AccordionItem
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsDisabled:
						this._setUpDisabledState();
						this._setUpEvents();
						break;
					case Enum.Properties.StartsExpanded:
						console.warn(
							`${GlobalEnum.PatternsNames.AccordionItem} (${this.widgetId}): changes to ${Enum.Properties.StartsExpanded} parameter do not affect the ${GlobalEnum.PatternsNames.AccordionItem}. Use the client actions 'AccordionItemExpand' and 'AccordionItemCollapse' to affect the ${GlobalEnum.PatternsNames.AccordionItem}.`
						);
						break;
				}
			}
		}

		// This method will open and then close the item to get its final value; then, it will run an animation
		// from the item's inital height to 0
		public close(): void {
			Helper.Dom.Attribute.Remove(this._accordionItemContentElem, GlobalEnum.HTMLAttributes.Style);
			const expandedHeight = this._accordionItemContentElem.getBoundingClientRect().height;
			// We know the final height is 0 - it is being collapsed
			const collapsedHeight = 0;

			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Closed);
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.Open);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemContentElem,
				GlobalEnum.InlineStyle.Height,
				expandedHeight + GlobalEnum.Units.Pixel
			);

			// Removes collapsed class and adds the expanded class to animate
			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Expanded);
			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Collapsed);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Animation);
				Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Expanded);

				Helper.Dom.Styles.SetStyleAttribute(
					this._accordionItemContentElem,
					GlobalEnum.InlineStyle.Height,
					collapsedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionItemContentElem.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnTransitionEnd
				);
				// End of animation, item is collapsed
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Collapsed);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this._isOpen = false;
			this._setAriaExpanded(false, true);
			this._onToggleCallback();
		}

		public dispose(): void {
			this.unsetCallbacks();
			this._accordionParentElem?.removeAccordionItem(this.uniqueId);
			this.unsetHtmlElements();
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
				this._accordionItemTitleElem,
				GlobalEnum.InlineStyle.PointerEvents,
				GlobalEnum.CssProperties.None
			);

			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Collapsed);
			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Expanded);

			Helper.Dom.Attribute.Remove(this._accordionItemTitleElem, GlobalEnum.HTMLAttributes.Style);

			const expandedHeight = this._accordionItemContentElem.getBoundingClientRect().height;

			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Collapsed);
			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.Expanded);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemContentElem,
				GlobalEnum.InlineStyle.Height,
				collapsedHeight + GlobalEnum.Units.Pixel
			);

			const waitDomIterateTimeout = setTimeout(() => {
				// Adds is--animating class to current accordion item content to obtain the final height value
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Animation);
				Helper.Dom.Styles.SetStyleAttribute(
					this._accordionItemContentElem,
					GlobalEnum.InlineStyle.Height,
					expandedHeight + GlobalEnum.Units.Pixel
				);

				this._accordionItemContentElem.addEventListener(
					GlobalEnum.HTMLEvent.TransitionEnd,
					this._eventOnTransitionEnd
				);

				// End of animation, item is expanded
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.Expanded);

				clearTimeout(waitDomIterateTimeout);
			}, 100);

			this._isOpen = true;
			this._setAriaExpanded(true, false);
			this._onToggleCallback();

			if (this._accordionParentElem) this._accordionParentElem.triggerAccordionItemClose(this.uniqueId);
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			if (this._platformEventOnToggle === undefined) {
				this._platformEventOnToggle = callback;
			}
		}
	}
}
