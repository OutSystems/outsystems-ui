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
			this._eventOnSubmenuKeypress = this._onSubmenuKeypress.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			if (this._hasElements) {
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
				this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnSubmenuKeypress);
			}

			OSUIFramework.Event.Internal.GetEventManagerInstance().addHandler(
				OSUIFramework.Event.Internal.Events.SubmenuOpen,
				this._onSubmenuEventTriggered.bind(this)
			);
		}

		// Trigger the submenu at toggle behaviour
		private _onSubmenuClick(e: MouseEvent): void {
			this._onSubmenuToggle();

			e.stopPropagation();
		}

		// Prevent close submenu based on a uniqueID validation, when his event his triggered
		private _onSubmenuEventTriggered(element: string): void {
			if (element !== this.uniqueId) {
				if (this._isOpen) {
					this.close();
				}
			}
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _onSubmenuKeypress(e: KeyboardEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);
			const _isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const _isEnterPressed = e.key === GlobalEnum.Keycodes.Enter;
			const _isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			const _isShiftPressed = e.shiftKey;

			//Open the submenu
			if (_isEnterPressed) {
				this._onSubmenuToggle();

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

		// Trigger the submenu behavior based on visibility
		private _onSubmenuToggle(): void {
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
			setTimeout(() => {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);
			}, 0);

			this._isOpen = true;

			this._updateAccessibilityProps();

			// Trigger event to close other submenu instances
			OSUIFramework.Event.Internal.GetEventManagerInstance().trigger(
				OSUIFramework.Event.Internal.Events.SubmenuOpen,
				this.uniqueId
			);
		}
	}
}
