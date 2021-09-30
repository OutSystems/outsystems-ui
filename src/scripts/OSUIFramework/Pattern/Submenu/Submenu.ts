// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Submenu {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Submenu extends AbstractPattern<SubmenuConfig> implements ISubmenu {
		// Store the pattern locals
		private _allSubmenus: NodeList;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenu: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenuClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenuFocus: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenuKeypress: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSubmenuLinksClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _globalEventOnBodyClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _globalEventOnSubmenuOpen: any;
		private _hasActiveLinks = false;
		private _hasElements = false;
		private _isIos = false;
		private _isMobile = false;
		private _isOpen = false;
		private _submenuActiveLinks: NodeList;
		private _submenuAllLinks: HTMLAnchorElement[];
		private _submenuElementClicked: HTMLElement;
		private _submenuHeader: HTMLElement;
		private _submenuItem: HTMLElement;
		private _submenuLinks: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SubmenuConfig(configs));

			this._eventOnSubmenuClick = this._onSubmenuClick.bind(this);
			this._eventOnSubmenuFocus = this._onSubmenuFocus.bind(this);
			this._eventOnSubmenuLinksClick = this._onSubmenuLinksClick.bind(this);
			this._eventOnSubmenuKeypress = this._onSubmenuKeypress.bind(this);
			this._globalEventOnSubmenuOpen = this._onSubmenuOpenEvent.bind(this);
			this._globalEventOnBodyClick = this._onBodyClick.bind(this);
		}

		// Add Pattern Events
		private _addEvents(): void {
			// Set variables based on device detection classes
			this._isIos = !!document.querySelector(Constants.Dot + GlobalEnum.MobileOS.IOS);
			this._isMobile = !!(
				document.querySelector(Constants.Dot + GlobalEnum.MobileOS.Android) ||
				document.querySelector(Constants.Dot + GlobalEnum.MobileOS.IOS)
			);

			// Set event type based on device
			if (this._isMobile) {
				this._eventOnSubmenu = GlobalEnum.HTMLEvent.TouchStart;
			} else {
				this._eventOnSubmenu = GlobalEnum.HTMLEvent.Click;
			}

			if (this._hasElements) {
				this._submenuHeader.addEventListener(this._eventOnSubmenu, this._eventOnSubmenuClick);
				this._submenuHeader.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnSubmenuKeypress);
			} else {
				// Add event to force focus element when a user tap in an empty submenu on a iOS device
				if (this._isIos) {
					this._submenuHeader.addEventListener(this._eventOnSubmenu, this._eventOnSubmenuFocus);
				}
			}

			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.SubmenuOpen,
				this._globalEventOnSubmenuOpen
			);

			// For support reasons, the use case of adding the open class by ExtendedClass on submenu we will add the handler to close all on body click
			if (Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen)) {
				OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventOnBodyClick
				);
			}
		}

		// Close submenu, when BodyOnCLick event is triggered
		private _onBodyClick(args: string, e: MouseEvent): void {
			if (!this._selfElem.contains(e.target as HTMLElement)) {
				if (Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen) && !this._isOpen) {
					Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);
				} else if (this._isOpen) {
					this.close();
				}
			}

			e.preventDefault();

			e.stopPropagation();
		}

		// Trigger the submenu at toggle behaviour
		private _onSubmenuClick(e: MouseEvent): void {
			this._onSubmenuToggle();
			e.stopPropagation();
		}

		// Trigger the submenu at toggle behaviour
		private _onSubmenuFocus(e: MouseEvent): void {
			this._submenuHeader.focus();
			e.stopPropagation();
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
			}
			// Close the submenu when pressing Esc
			if (_isEscapedPressed && this._isOpen) {
				this.close();

				this._submenuHeader.focus();
			}

			// If navigate to outside of Submenu, close it
			if (_isShiftPressed && _isTabPressed && _clickedElem === this._submenuHeader) {
				if (_closestElem === this._selfElem && this._isOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		// This event was created to fix the issue on Native builds that can't focus on element clicked.
		private _onSubmenuLinksClick(e: MouseEvent): void {
			this._submenuElementClicked = e.target as HTMLElement;
			this._submenuElementClicked.focus();

			e.preventDefault();
		}

		// Prevent close submenu based on a uniqueID validation, when his event is triggered
		private _onSubmenuOpenEvent(element: string): void {
			if (element !== this.uniqueId) {
				if (this._isOpen) {
					this.close();
				}
			}
		}

		// Trigger the submenu behavior based on visibility
		private _onSubmenuToggle(): void {
			if (this._isOpen) {
				this.close();
			} else {
				this.open();

				// Trigger event to close other submenu instances
				OSUIFramework.Event.GlobalEventManager.Instance.trigger(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.SubmenuOpen,
					this.uniqueId
				);
			}
		}

		// Remove all the assigned Events
		private _removeEvents(): void {
			if (this._hasElements) {
				this._submenuHeader.removeEventListener(this._eventOnSubmenu, this._eventOnSubmenuClick);
				this._submenuHeader.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnSubmenuKeypress);
			} else {
				// Remove event to force focus element when a user tap in an empty submenu on a iOS device
				if (this._isIos) {
					this._submenuHeader.removeEventListener(this._eventOnSubmenu, this._eventOnSubmenuFocus);
				}
			}

			// Remove event only if is iOS
			if (this._isIos) {
				this._submenuLinks.removeEventListener(this._eventOnSubmenu, this._eventOnSubmenuLinksClick);
			}

			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.SubmenuOpen,
				this._globalEventOnSubmenuOpen
			);

			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventOnBodyClick
			);
		}

		// Add the Accessibility Attributes values
		private _setAccessibilityProps(): void {
			if (Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen)) {
				this._isOpen = true;
			}

			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.MenuItem
			);
			Helper.Attribute.Set(
				this._submenuHeader,
				Constants.AccessibilityAttribute.TabIndex,
				Constants.AccessibilityAttribute.States.TabIndexShow
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
			this._submenuAllLinks = [...this._submenuLinks.querySelectorAll(GlobalEnum.HTMLElement.Link)];
			this._submenuActiveLinks = this._submenuLinks.querySelectorAll(Constants.Dot + Enum.CssClass.PatternActive);

			// Check if submenu has childs
			if (this._submenuAllLinks.length > 0) {
				this._hasElements = true;
			}

			// Check if submenu contains elements with active class
			if (this._submenuActiveLinks.length > 0) {
				this._hasActiveLinks = true;
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			if (this._hasActiveLinks) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternActive);
			}

			if (this._hasElements) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsDropdown);
			} else {
				Helper.Style.AddClass(this._submenuLinks, Enum.CssClass.PatternIsHidden);
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

			this._submenuAllLinks.forEach((item: HTMLElement) => {
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

			this._setInitialCssClasses();

			this._setAccessibilityProps();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this._addEvents.bind(this));

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

			// Remove event only if is iOS
			if (this._isIos) {
				this._submenuLinks.removeEventListener(this._eventOnSubmenu, this._eventOnSubmenuLinksClick);
			}

			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventOnBodyClick
			);
		}

		// Destroy the Submenu
		public dispose(): void {
			super.dispose();

			this._removeEvents();
		}

		// Open Submenu
		public open(): void {
			Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			this._submenuHeader.focus();

			this._isOpen = true;

			this._updateAccessibilityProps();

			// Add event only if is iOS
			if (this._isIos) {
				this._submenuLinks.addEventListener(this._eventOnSubmenu, this._eventOnSubmenuLinksClick);
			}

			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventOnBodyClick
			);
		}
	}
}
