// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.AccordionItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class AccordionItem
		extends AbstractChild<AccordionItemConfig, Accordion.IAccordion>
		implements IAccordionItem
	{
		// Stores the HTML element of the pattern's content
		private _accordionItemContentElem: HTMLElement;
		// Stores the HTML element of the pattern's icon
		private _accordionItemIconCustomElem: HTMLElement;
		// Stores the HTML element of the pattern's icon
		private _accordionItemIconElem: HTMLElement;
		// Stores the HTML element of the pattern's placeholder
		private _accordionItemPlaceholder: HTMLElement;
		// Stores the HTML element of the pattern's title
		private _accordionItemTitleElem: HTMLElement;
		// Stores if should be aware of elements clickable inside the title
		private _allowTitleEvents: boolean;
		// Store the collapsed height value
		private _collapsedHeight = 0;
		// Store the click event with bind(this)
		private _eventOnClick: GlobalCallbacks.Generic;
		//Stores the transition end callback function
		private _eventOnTransitionEnd: GlobalCallbacks.Generic;
		//Stores the keyboard callback function
		private _eventOnkeyPress: GlobalCallbacks.Generic;
		// Store the expanded height value
		private _expandedHeight: number;
		// Stores if the element is open
		private _isOpen: boolean;
		// Callback function to trigger the click event on the platform
		private _platformEventOnToggle: GlobalCallbacks.Generic;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new AccordionItemConfig(configs));

			this._isOpen = this.configs.StartsExpanded;
		}

		// Method to handle the click event
		private _accordionOnClickHandler(event: MouseEvent): void {
			if (this._allowTitleEvents) {
				if (
					event?.target !== this._accordionItemTitleElem &&
					event?.target !== this._accordionItemIconElem &&
					event?.target !== this._accordionItemTitleElem.firstChild
				) {
					return;
				}
			}

			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		// Method to add the event listeners
		private _addEvents(): void {
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);
		}

		// Method to handle async animation
		private _animationAsync(isExpand: boolean): void {
			const finalHeight = isExpand ? this._expandedHeight : this._collapsedHeight;

			// Adds is--animating class to current accordion item content to obtain the final height value
			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternAnimating);

			if (!isExpand) {
				Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);
			}

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemContentElem,
				GlobalEnum.InlineStyle.Height,
				finalHeight + GlobalEnum.Units.Pixel
			);

			this._accordionItemContentElem.addEventListener(
				GlobalEnum.HTMLEvent.TransitionEnd,
				this._eventOnTransitionEnd
			);

			if (isExpand) {
				// End of animation, item is expanded
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);
				this._isOpen = true;
			} else {
				// End of animation, item is collapsed
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternCollapsed);
				this._isOpen = false;
			}

			this.setA11yProperties();
			this._onToggleCallback();
		}

		// Method to handle the tabindex values
		private _handleTabIndex(): void {
			const titleTabindexValue = this.configs.IsDisabled
				? Constants.A11YAttributes.States.TabIndexHidden
				: Constants.A11YAttributes.States.TabIndexShow;
			const contentTabindexValue =
				!this.configs.IsDisabled && this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden;

			Helper.A11Y.TabIndex(this._accordionItemTitleElem, titleTabindexValue);
			Helper.A11Y.TabIndex(this._accordionItemContentElem, contentTabindexValue);
		}

		// Method to hadle Keyboardpress event
		private _onKeyboardPress(event: KeyboardEvent): void {
			const isEscapedKey = event.key === GlobalEnum.Keycodes.Escape;
			const isEnterOrSpaceKey =
				event.key === GlobalEnum.Keycodes.Enter || event.key === GlobalEnum.Keycodes.Space;

			if (isEscapedKey || isEnterOrSpaceKey) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				return;
			}

			//If open, close AccordionItem
			if (this._isOpen) {
				this.close();
				// If close, and Enter/Space pressed, open Acordion
			} else if (isEnterOrSpaceKey && !this._isOpen) {
				this.open();
			}
		}

		// Method to handle the keyboard interactions
		private _onToggleCallback(): void {
			Helper.AsyncInvocation(this._platformEventOnToggle, this.widgetId, this._isOpen);
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);
		}

		// Method to set the parent Info, if an accordion wrapper is being used
		private _setAccordionParent(): void {
			// Get parent info
			this.setParentInfo(
				Constants.Dot + Accordion.Enum.CssClass.Pattern,
				OutSystems.OSUI.Patterns.AccordionAPI.GetAccordionById,
				true
			);

			// Notify parent about a new instance of this child has been created!
			if (this.parentObject) {
				this.notifyParent(Accordion.Enum.ChildNotifyActionType.Add);
			}
		}

		// Method that changes the icon's position
		private _setIconPosition(): void {
			//If the page we're on is RTL, the icon's position has to change accordingly.
			if (this.configs.IconPosition === GlobalEnum.Direction.Right) {
				Helper.Dom.Styles.RemoveClass(this._accordionItemTitleElem, Enum.CssClass.PatternIconPositionIsLeft);
				Helper.Dom.Styles.AddClass(this._accordionItemTitleElem, Enum.CssClass.PatternIconPositionIsRight);
			} else {
				Helper.Dom.Styles.RemoveClass(this._accordionItemTitleElem, Enum.CssClass.PatternIconPositionIsRight);
				Helper.Dom.Styles.AddClass(this._accordionItemTitleElem, Enum.CssClass.PatternIconPositionIsLeft);
			}
		}

		// Method that changes the icon's type (Caret, Plus/Minus, Custom)
		private _setIconType(): void {
			switch (this.configs.Icon) {
				case Enum.IconType.PlusMinus:
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconCaret);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconCustom);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconElem, Enum.CssClass.PatternIconPlusMinus);
					break;
				case Enum.IconType.Custom:
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconPlusMinus);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconCaret);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconCustom);
					break;
				default:
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconPlusMinus);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconCustom);
					Helper.Dom.Styles.RemoveClass(this._accordionItemIconElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconCustomElem, Enum.CssClass.PatternIconHidden);
					Helper.Dom.Styles.AddClass(this._accordionItemIconElem, Enum.CssClass.PatternIconCaret);
					break;
			}
		}

		// Method to handle the IsDisabled state
		private _setIsDisabledState(): void {
			if (this.configs.IsDisabled) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternDisabled);
				Helper.A11Y.AriaDisabledTrue(this._selfElem);
				this._removeEvents();
				this.unsetCallbacks();
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternDisabled);
				Helper.A11Y.AriaDisabledFalse(this._selfElem);
				this.setCallbacks();
				this._addEvents();
			}

			// Update tabindex values
			this._handleTabIndex();
		}

		// Method to handle the onTransitionEnd on accordion toggle animation
		private _transitionEndHandler(): void {
			if (this._accordionItemContentElem) {
				Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.PatternAnimating);

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

		/**
		 * Method to handle Accessibility attributes
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected setA11yProperties(): void {
			// Set the static attributes on page load only
			if (this.isBuilt === false) {
				// Set ARIA Controls
				Helper.A11Y.AriaControls(this._selfElem, this._accordionItemPlaceholder.id);

				// Set ARIA LabelledBy
				Helper.A11Y.AriaLabelledBy(this._accordionItemContentElem, this._accordionItemTitleElem.id);

				// Set aria-hidden to icon
				Helper.A11Y.AriaHiddenTrue(this._accordionItemIconElem);

				// Set ARIA Disabled
				Helper.A11Y.AriaDisabled(this._selfElem, this.configs.IsDisabled);

				// Set roles
				Helper.A11Y.RoleTab(this._selfElem);
				Helper.A11Y.RoleButton(this._accordionItemTitleElem);
				Helper.A11Y.RoleTabPanel(this._accordionItemPlaceholder);
			}

			// Set Tabindex
			this._handleTabIndex();

			// Set ARIA Expanded
			Helper.A11Y.AriaExpanded(this._selfElem, this._isOpen.toString());
			Helper.A11Y.AriaExpanded(this._accordionItemTitleElem, this._isOpen.toString());

			// Set aria-hidden to content
			Helper.A11Y.AriaHidden(this._accordionItemContentElem, (!this._isOpen).toString());
		}

		/**
		 * Method to set the listeners and callbacks
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._accordionOnClickHandler.bind(this);
			this._eventOnTransitionEnd = this._transitionEndHandler.bind(this);
			this._eventOnkeyPress = this._onKeyboardPress.bind(this);
		}

		/**
		 * Method that sets the HTML elements of the Accordion Item
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected setHtmlElements(): void {
			this._accordionItemTitleElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTitle);
			this._accordionItemContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._accordionItemIconElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternIcon);
			// Getting the custom icon that is also a placeholder (ph)
			this._accordionItemIconCustomElem = Helper.Dom.ClassSelector(
				this._selfElem,
				Enum.CssClass.PatternIcon + '.' + GlobalEnum.CssClassElements.Placeholder
			);
			this._accordionItemPlaceholder = this._accordionItemContentElem.firstChild as HTMLElement;
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected setInitialCssClasses(): void {
			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternOpen);
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);
			} else {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternClosed);
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternCollapsed);
			}

			this._setIconType();
			this._setIconPosition();
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof AccordionItem
		 */
		protected unsetCallbacks(): void {
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

		/**
		 * isDisabled getter
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof AccordionItem
		 */
		public get isDisabled(): boolean {
			return this.configs.IsDisabled;
		}

		/**
		 * IsOpen getter
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof AccordionItem
		 */
		public get isOpen(): boolean {
			return this._isOpen;
		}

		/**
		 * Method to prevent clicks inside thte title to open the accordion
		 *
		 * @memberof AccordionItem
		 */
		public allowTitleEvents(): void {
			this._allowTitleEvents = true;
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof AccordionItem
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();
			this.setInitialCssClasses();

			this._setAccordionParent();

			this._setIsDisabledState();
			this.setA11yProperties();

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
						this._setIsDisabledState();
						break;
					case Enum.Properties.StartsExpanded:
						console.warn(
							`${GlobalEnum.PatternName.AccordionItem} (${this.widgetId}): changes to ${Enum.Properties.StartsExpanded} parameter do not affect the ${GlobalEnum.PatternName.AccordionItem}. Use the client actions 'AccordionItemExpand' and 'AccordionItemCollapse' to affect the ${GlobalEnum.PatternName.AccordionItem}.`
						);
						break;
					case Enum.Properties.IconPosition:
						this._setIconPosition();
						break;
					case Enum.Properties.Icon:
						this._setIconType();
				}
			}
		}

		/**
		 * Method to close the AccordionItem
		 *
		 * @memberof AccordionItem
		 */
		public close(): void {
			if (!this._isOpen) {
				return;
			}

			Helper.Dom.Attribute.Remove(this._accordionItemContentElem, GlobalEnum.HTMLAttributes.Style);
			this._expandedHeight = this._accordionItemContentElem.getBoundingClientRect().height;

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternClosed);
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternOpen);

			// Removes collapsed class and adds the expanded class to animate
			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemContentElem,
				GlobalEnum.InlineStyle.Height,
				this._expandedHeight + GlobalEnum.Units.Pixel
			);

			Helper.AsyncInvocation(() => {
				this._animationAsync(false);
			});
		}

		/**
		 * Method to remove event listener and destroy AccordionItem instance
		 *
		 * @memberof AccordionItem
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this._removeEvents();

			if (this.parentObject) {
				// Notify parent about this instance will be destroyed
				this.notifyParent(Accordion.Enum.ChildNotifyActionType.Removed);
			}

			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Method to open the AccordionItem
		 *
		 * @memberof AccordionItem
		 */
		public open(): void {
			if (this._isOpen) {
				return;
			}

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternClosed);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternOpen);

			// While the animation is running, we don't want any clicks happening on the title
			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemTitleElem,
				GlobalEnum.InlineStyle.PointerEvents,
				GlobalEnum.CssProperties.None
			);

			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.PatternCollapsed);
			Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);

			Helper.Dom.Attribute.Remove(this._accordionItemTitleElem, GlobalEnum.HTMLAttributes.Style);

			this._expandedHeight = this._accordionItemContentElem.getBoundingClientRect().height;

			Helper.Dom.Styles.RemoveClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);

			Helper.Dom.Styles.SetStyleAttribute(
				this._accordionItemContentElem,
				GlobalEnum.InlineStyle.Height,
				this._collapsedHeight
			);

			Helper.AsyncInvocation(() => {
				this._animationAsync(true);
			});

			// Notify parent about this Item toggled
			if (this.parentObject) {
				this.notifyParent(Accordion.Enum.ChildNotifyActionType.Click);
			}
		}

		/**
		 * Set callbacks for the onToggle event
		 *
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof AccordionItem
		 */
		public registerCallback(callback: GlobalCallbacks.OSGeneric): void {
			if (this._platformEventOnToggle === undefined) {
				this._platformEventOnToggle = callback;
			} else {
				console.warn(`The ${GlobalEnum.PatternName.AccordionItem} already has the toggle callback set.`);
			}
		}
	}
}
