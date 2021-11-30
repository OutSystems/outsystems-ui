// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Submenu {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Submenu extends AbstractPattern<SubmenuConfig> implements ISubmenu {
		// Store the pattern locals
		private _eventClick: Callbacks.Generic;
		private _eventClickLinks: Callbacks.Generic;
		private _eventFocus: Callbacks.Generic;
		private _eventKeypress: Callbacks.Generic;
		private _globalEventBody: Callbacks.Generic;
		private _globalEventOpen: Callbacks.Generic;
		private _hasActiveLinks = false;
		private _hasElements = false;
		private _isOpen = false;
		private _submenuActiveLinksElement: NodeList;
		private _submenuAllLinksElement: HTMLAnchorElement[];
		private _submenuClickedElement: HTMLElement;
		private _submenuEventType: GlobalEnum.HTMLEvent;
		private _submenuHeaderElement: HTMLElement;
		private _submenuItemElement: HTMLElement;
		private _submenuLinksElement: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SubmenuConfig(configs));
		}

		// Close submenu, when BodyOnCLick event is triggered
		private _bodyClickCallback(args: string, e: MouseEvent): void {
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
		private _clickCallback(e: MouseEvent): void {
			this._toggleSubmenu();
			e.stopPropagation();
		}

		// This event was created to fix the issue on Native builds that can't focus on element clicked.
		private _clickLinksCallback(e: MouseEvent): void {
			this._submenuClickedElement = e.target as HTMLElement;
			this._submenuClickedElement.focus();

			e.preventDefault();
		}

		// Trigger the submenu at toggle behaviour
		private _focusCallback(e: MouseEvent): void {
			this._submenuHeaderElement.focus();
			e.stopPropagation();
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _keypressCallback(e: KeyboardEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest(Constants.Dot + Enum.CssClass.Pattern);
			const _isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const _isEnterPressed = e.key === GlobalEnum.Keycodes.Enter;
			const _isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			const _isShiftPressed = e.shiftKey;

			//Open the submenu
			if (_isEnterPressed) {
				this._toggleSubmenu();
			}
			// Close the submenu when pressing Esc
			if (_isEscapedPressed && this._isOpen) {
				this.close();

				this._submenuHeaderElement.focus();
			}

			// If navigate to outside of Submenu, close it
			if (_isShiftPressed && _isTabPressed && _clickedElem === this._submenuHeaderElement) {
				if (_closestElem === this._selfElem && this._isOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		// Prevent close submenu based on a uniqueID validation, when his event is triggered
		private _openCallback(element: string): void {
			if (element !== this.uniqueId) {
				if (this._isOpen) {
					this.close();
				}
			}
		}

		// Trigger the submenu behavior based on visibility
		private _toggleSubmenu(): void {
			if (this._isOpen) {
				this.close();
			} else {
				// Trigger event to close other submenu instances
				OSUIFramework.Event.GlobalEventManager.Instance.trigger(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.SubmenuOpen,
					this.uniqueId
				);

				// Make async the method call
				Helper.AsyncInvocation(this.open.bind(this));
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _updateA11yProperties(): void {
			Helper.A11Y.AriaExpanded(this._submenuHeaderElement, this._isOpen.toString());
			Helper.A11Y.AriaHidden(this._submenuLinksElement, (!this._isOpen).toString());

			// Update the tabindex of each link
			this._submenuAllLinksElement.forEach((item: HTMLElement) => {
				this._isOpen ? Helper.A11Y.TabIndexTrue(item) : Helper.A11Y.TabIndexFalse(item);
			});
		}

		// Add the Accessibility Attributes values
		protected setA11yProperties(): void {
			if (Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen)) {
				this._isOpen = true;
			}

			// Apply the default A11Y
			Helper.A11Y.RoleMenuItem(this._submenuHeaderElement);
			Helper.A11Y.TabIndexTrue(this._submenuHeaderElement);
			Helper.A11Y.AriaControls(this._submenuHeaderElement, this._submenuLinksElement.id);
			Helper.A11Y.RoleButton(this._submenuItemElement);

			// Method that as the initial A11Y states and to be used on parameters changed
			this._updateA11yProperties();
		}

		// Add Pattern Events
		protected setCallbacks(): void {
			// Define the callbacks that will be used
			this._eventClick = this._clickCallback.bind(this);
			this._eventClickLinks = this._clickLinksCallback.bind(this);
			this._eventFocus = this._focusCallback.bind(this);
			this._eventKeypress = this._keypressCallback.bind(this);
			this._globalEventOpen = this._openCallback.bind(this);
			this._globalEventBody = this._bodyClickCallback.bind(this);

			// Set event type based on device
			this._submenuEventType = OSUIFramework.Helper.DeviceInfo.IsTouch
				? GlobalEnum.HTMLEvent.TouchStart
				: GlobalEnum.HTMLEvent.Click;

			// Add events only if has links inside
			if (this._hasElements) {
				this._submenuHeaderElement.addEventListener(this._submenuEventType, this._eventClick);
				this._submenuHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeypress);
			} else {
				// Add event to force focus element when a user tap in an empty submenu on a iOS device
				if (Helper.DeviceInfo.IsIos) {
					this._submenuHeaderElement.addEventListener(this._submenuEventType, this._eventFocus);
				}
			}

			// Add the handler to Event Manager
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.SubmenuOpen,
				this._globalEventOpen
			);

			// For support reasons, the use case of adding the open class by ExtendedClass on submenu we will add the handler to close all on body click
			if (Helper.Style.ContainsClass(this._selfElem, Enum.CssClass.PatternIsOpen)) {
				OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventBody
				);
			}
		}

		// Update info based on htmlContent
		protected setHtmlElements(): void {
			this._submenuHeaderElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternHeader);
			this._submenuItemElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternItem);
			this._submenuLinksElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternLinks);
			this._submenuAllLinksElement = [...this._submenuLinksElement.querySelectorAll(GlobalEnum.HTMLElement.Link)];
			this._submenuActiveLinksElement = this._submenuLinksElement.querySelectorAll(
				Constants.Dot + Enum.CssClass.PatternActive
			);

			// Check if submenu has childs
			if (this._submenuAllLinksElement.length > 0) {
				this._hasElements = true;
			}

			// Check if submenu contains elements with active class
			if (this._submenuActiveLinksElement.length > 0) {
				this._hasActiveLinks = true;
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		protected setInitialStates(): void {
			// Add active class to pattern based on links whit active state
			if (this._hasActiveLinks) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternActive);
			}

			// Add an identifier if the pattern as links
			if (this._hasElements) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsDropdown);
			} else {
				Helper.Style.AddClass(this._submenuLinksElement, Enum.CssClass.PatternIsHidden);
			}
		}

		// Remove all the assigned Events
		protected unsetCallbacks(): void {
			// Remove events only if has elements inside
			if (this._hasElements) {
				this._submenuHeaderElement.removeEventListener(this._submenuEventType, this._eventClick);
				this._submenuHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeypress);
			} else {
				// Remove event to force focus element when a user tap in an empty submenu on a iOS device
				if (Helper.DeviceInfo.IsIos) {
					this._submenuHeaderElement.removeEventListener(this._submenuEventType, this._eventFocus);
				}
			}

			// Remove event only if is iOS
			if (Helper.DeviceInfo.IsIos) {
				this._submenuLinksElement.removeEventListener(this._submenuEventType, this._eventClickLinks);
			}

			// Remove global handlers
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.SubmenuOpen,
				this._globalEventOpen
			);

			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventBody
			);

			// Reassign the elements to undefined, preventing memory leaks
			this._eventClick = undefined;
			this._eventClickLinks = undefined;
			this._eventFocus = undefined;
			this._eventKeypress = undefined;
			this._globalEventOpen = undefined;
			this._globalEventBody = undefined;
		}

		// Reassign the HTML elements to undefined, preventing memory leaks
		protected unsetHtmlElements(): void {
			this._submenuHeaderElement = undefined;
			this._submenuItemElement = undefined;
			this._submenuLinksElement = undefined;
			this._submenuAllLinksElement = undefined;
			this._submenuActiveLinksElement = undefined;
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setInitialStates();

			this.setA11yProperties();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setCallbacks.bind(this));

			this.finishBuild();
		}

		// Close Submenu
		public close(): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			this._isOpen = false;

			this._updateA11yProperties();

			// Remove event only if is iOS
			if (Helper.DeviceInfo.IsIos) {
				this._submenuLinksElement.removeEventListener(this._submenuEventType, this._eventClickLinks);
			}

			// Remove the handler from Event Manager when is closed
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventBody
			);
		}

		// Destroy the Submenu
		public dispose(): void {
			super.dispose();

			// Remove event listners
			this.unsetCallbacks();

			// Remove unused HTML elements
			this.unsetHtmlElements();
		}

		// Open Submenu
		public open(): void {
			Helper.Style.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			this._submenuHeaderElement.focus();

			this._isOpen = true;

			this._updateA11yProperties();

			// Add event only if is iOS
			if (Helper.DeviceInfo.IsIos) {
				this._submenuLinksElement.addEventListener(this._submenuEventType, this._eventClickLinks);
			}

			// Add the handler to Event Manager when is opened
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventBody
			);
		}
	}
}
