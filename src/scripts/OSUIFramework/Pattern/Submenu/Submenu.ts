// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Submenu {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Submenu extends AbstractPattern<SubmenuConfig> implements ISubmenu {
		// Store the pattern locals
		private _allSubmenus: NodeList;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenuKeypress: any;
		private _hasElements = false;
		private _isOpen = false;
		private _submenuAllLinks: NodeList;
		private _submenuHeader: HTMLElement;
		private _submenuItem: HTMLElement;
		private _submenuLinks: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SubmenuConfig(configs));

			this._eventOnClick = this._onSubmenuClick.bind(this);
			this._eventOnSubmenuKeypress = this._submenuOnKeypress.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			if (this._hasElements) {
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnSubmenuKeypress);
			}
		}

		// Close all open submenus
		private _closeAllSubmenus(): void {
			this._allSubmenus = document.querySelectorAll(
				Constants.Dot + Enum.CssClass.Pattern + Constants.Dot + Enum.CssClass.PatternIsOpen
			);

			this._allSubmenus.forEach((item: HTMLElement) => {
				Helper.Attribute.Set(
					item.querySelector(Constants.Dot + Enum.CssClass.PatternHeader),
					Constants.AccessibilityAttribute.Aria.Expanded,
					Constants.AccessibilityAttribute.States.False
				);

				Helper.Attribute.Set(
					item.querySelector(Constants.Dot + Enum.CssClass.PatternLinks),
					Constants.AccessibilityAttribute.Aria.Hidden,
					Constants.AccessibilityAttribute.States.True
				);
				Helper.Style.RemoveClass(item, Enum.CssClass.PatternIsOpen);
				this._updateTabIndex(item.querySelectorAll(Constants.Link));
			});
		}

		// Trigger the submenu at toggle behaviour
		private _onSubmenuClick(e: MouseEvent): void {
			this._onToggle();

			e.stopPropagation();
		}

		// Trigger the submenu at toggle behaviour
		private _onToggle(): void {
			// Validate the visibility of submenu and update the value _isOpen when it's clicked on other submenu instatiation
			if (this._isOpen && !Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen)) {
				this._isOpen = false;
			}

			// Toggle the Submenu classes
			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.MenuItem
			);
			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.TabIndex,
				this._hasElements
					? Constants.AccessibilityAttribute.States.TabIndexShow
					: Constants.AccessibilityAttribute.States.TabIndexHidden
			);
			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.Aria.Controls,
				this._submenuLinks.id
			);

			Helper.Attribute.Set(
				this._submenuItem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Button
			);

			this._updateAccessibilityProps();
		}

		// Update info based on htmlContent
		private _setHtmlElements(): void {
			this._submenuHeader = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternHeader);
			this._submenuItem = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternItem);
			this._submenuLinks = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternLinks);
			this._submenuAllLinks = this._submenuLinks.querySelectorAll(Constants.Link);

			if (this._submenuAllLinks.length > 0) {
				this._hasElements = true;
			}
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _submenuOnKeypress(e: KeyboardEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);
			const _isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const _isEnterPressed = e.key === GlobalEnum.Keycodes.Enter;
			const _isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			const _isShiftPressed = e.shiftKey;

			//Open the submenu
			if (_isEnterPressed) {
				this._onToggle();

				e.stopPropagation();
			}
			// Close the submenu when pressing Esc
			if (_isEscapedPressed && this._isOpen) {
				this.close();

				this._submenuHeader.focus();

				e.stopPropagation();
			}

			// If navigate to outside of Submenu, close it
			if (_isShiftPressed && _isTabPressed && _clickedElem === this._submenuHeader) {
				if (_closestElem === this._selfElem && this._isOpen) {
					this.close();

					e.stopPropagation();
				}
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _updateAccessibilityProps(): void {
			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.Aria.Expanded,
				this._isOpen.toString()
			);

			Helper.Attribute.Set(
				this._submenuLinks,
				Constants.AccessibilityAttribute.Aria.Hidden,
				(!this._isOpen).toString()
			);

			this._updateTabIndex(this._submenuAllLinks);
		}

		// Update tabindex of list of elements
		private _updateTabIndex(itemList): void {
			itemList = [].slice.call(itemList);
			itemList.forEach((item: HTMLElement) => {
				Helper.Attribute.Set(
					item,
					Constants.AccessibilityAttribute.TabIndex,
					this._isOpen
						? Constants.AccessibilityAttribute.States.TabIndexShow
						: Constants.AccessibilityAttribute.States.TabIndexHidden
				);
			});
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setAccessibilityProps();

			this._addEvents();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			super.changeProperty(propertyName, propertyValue);
		}

		//toggle

		// Close Submenu
		public close(): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);
			this._isOpen = false;

			this._updateAccessibilityProps();
		}

		// Destroy the Submenu
		public dispose(): void {
			super.dispose();
		}

		// Open Submenu
		public open(): void {
			this._closeAllSubmenus();

			setTimeout(() => {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);
			}, 0);

			this._isOpen = true;

			this._updateAccessibilityProps();
		}
	}
}
