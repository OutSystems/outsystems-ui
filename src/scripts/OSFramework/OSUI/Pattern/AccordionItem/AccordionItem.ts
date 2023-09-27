// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.AccordionItem {
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
		// Stores the HTML element of the pattern's title placeholder
		private _accordionTitleFocusableChildren: HTMLElement[];
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

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @param {MouseEvent} event
		 * @return {*}  {void}
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method to add the event listeners
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _addEvents(): void {
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);
		}

		/**
		 * Method to handle async animation
		 *
		 * @private
		 * @param {boolean} isExpand
		 * @memberof AccordionItem
		 */
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

			this.setA11YProperties();
			this._onToggleCallback();
		}

		/**
		 * Method to handle the tabindex values
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _handleTabIndex(): void {
			const titleTabindexValue = this.configs.IsDisabled
				? Constants.A11YAttributes.States.TabIndexHidden
				: Constants.A11YAttributes.States.TabIndexShow;
			const titleFocusableElementsTabindexValue =
				!this.configs.IsDisabled && this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden;

			Helper.A11Y.TabIndex(this._accordionItemTitleElem, titleTabindexValue);

			// The focusable elements inside the Accordion Title must be non-focusable unless the Accordion is expanded
			for (const child of this._accordionTitleFocusableChildren) {
				Helper.A11Y.TabIndex(child as HTMLElement, titleFocusableElementsTabindexValue);
			}
		}

		/**
		 * Method to handle Keyboardpress event
		 *
		 * @private
		 * @param {KeyboardEvent} event
		 * @return {*}  {void}
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method to handle the keyboard interactions
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _onToggleCallback(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this._isOpen);
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _removeEvents(): void {
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
			this._accordionItemTitleElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnkeyPress);
		}

		/**
		 * Method to set the parent Info, if an accordion wrapper is being used
		 *
		 * @private
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method that changes the icon's position
		 *
		 * @private
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method that changes the icon's type (Caret, Plus/Minus, Custom)
		 *
		 * @private
		 * @memberof AccordionItem
		 */
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

		/**
		 * Method to handle the IsDisabled state
		 *
		 * @private
		 * @memberof AccordionItem
		 */
		private _setIsDisabledState(): void {
			if (this.configs.IsDisabled) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternDisabled);
				Helper.A11Y.AriaDisabledTrue(this.selfElement);
				this._removeEvents();
				this.unsetCallbacks();
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternDisabled);
				Helper.A11Y.AriaDisabledFalse(this.selfElement);
				this.setCallbacks();
				this._addEvents();
			}

			// Update tabindex values
			this._handleTabIndex();
		}

		/**
		 * Method to handle the onTransitionEnd on accordion toggle animation
		 *
		 * @private
		 * @memberof AccordionItem
		 */
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
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		protected setA11YProperties(): void {
			// Set the static attributes on page load only
			if (this.isBuilt === false) {
				// Set ARIA Controls
				Helper.A11Y.AriaControls(this._accordionItemTitleElem, this._accordionItemPlaceholder.id);

				// Set ARIA LabelledBy
				Helper.A11Y.AriaLabelledBy(this._accordionItemContentElem, this._accordionItemTitleElem.id);

				// Set aria-hidden to icon
				Helper.A11Y.AriaHiddenTrue(this._accordionItemIconElem);

				// Set ARIA Disabled
				Helper.A11Y.AriaDisabled(this._accordionItemTitleElem, this.configs.IsDisabled);

				// Set roles
				Helper.A11Y.RoleButton(this._accordionItemTitleElem);
				Helper.A11Y.RoleRegion(this._accordionItemContentElem);
			}

			// Set Tabindex
			this._handleTabIndex();

			// Set ARIA Expanded
			Helper.A11Y.AriaExpanded(this._accordionItemTitleElem, this._isOpen.toString());

			// Set aria-hidden to content
			Helper.A11Y.AriaHidden(this._accordionItemContentElem, (!this._isOpen).toString());

			// The focusable elements inside the Accordion Title must be hidden unless the Accordion is expanded
			for (const child of this._accordionTitleFocusableChildren) {
				Helper.A11Y.AriaHidden(child, (!this._isOpen).toString());
			}
		}

		/**
		 * Method to set the listeners and callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._accordionOnClickHandler.bind(this);
			this._eventOnTransitionEnd = this._transitionEndHandler.bind(this);
			this._eventOnkeyPress = this._onKeyboardPress.bind(this);
		}

		/**
		 * Method to set the HTML elements of the Accordion Item
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		protected setHtmlElements(): void {
			this._accordionItemTitleElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternTitle);
			this._accordionItemContentElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternContent);
			this._accordionItemIconElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternIcon);
			// Getting the custom icon that is also a placeholder (ph)
			this._accordionItemIconCustomElem = Helper.Dom.ClassSelector(
				this.selfElement,
				Enum.CssClass.PatternIcon + '.' + GlobalEnum.CssClassElements.Placeholder
			);
			this._accordionItemPlaceholder = this._accordionItemContentElem.firstChild as HTMLElement;

			// Get all focusable elements inside Accordion Title
			this._accordionTitleFocusableChildren = Helper.Dom.TagSelectorAll(
				this._accordionItemTitleElem,
				Constants.FocusableElems
			);
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		protected setInitialCssClasses(): void {
			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternOpen);
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternExpanded);
			} else {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternClosed);
				Helper.Dom.Styles.AddClass(this._accordionItemContentElem, Enum.CssClass.PatternCollapsed);
			}

			this._setIconType();
			this._setIconPosition();
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
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
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		protected unsetHtmlElements(): void {
			this._accordionItemTitleElem = undefined;
			this._accordionItemContentElem = undefined;
			this._accordionItemIconElem = undefined;
			this._accordionItemPlaceholder = undefined;
			this._accordionTitleFocusableChildren = [];
		}

		/**
		 * Method to return the isDisabled value
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public get isDisabled(): boolean {
			return this.configs.IsDisabled;
		}

		/**
		 * Method to return the IsOpen value
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public get isOpen(): boolean {
			return this._isOpen;
		}

		/**
		 * Method to prevent clicks inside thte title to open the accordion
		 *
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public allowTitleEvents(): void {
			this._allowTitleEvents = true;
		}

		/**
		 * Method to build the AccordionItem
		 *
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();
			this.setInitialCssClasses();

			this._setAccordionParent();

			this._setIsDisabledState();
			this.setA11YProperties();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
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
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public close(): void {
			if (!this._isOpen) {
				return;
			}

			Helper.Dom.Attribute.Remove(this._accordionItemContentElem, GlobalEnum.HTMLAttributes.Style);
			this._expandedHeight = this._accordionItemContentElem.getBoundingClientRect().height;

			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternClosed);
			Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternOpen);

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
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
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
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public open(): void {
			if (this._isOpen) {
				return;
			}

			Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternClosed);
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternOpen);

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
		 * Method to register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.AccordionItem.AccordionItem
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}
	}
}
