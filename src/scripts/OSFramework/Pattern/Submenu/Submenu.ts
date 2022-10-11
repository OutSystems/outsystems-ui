// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Submenu {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Submenu extends AbstractPattern<SubmenuConfig> implements ISubmenu {
		// Store the pattern locals
		private _dynamicallyOpening = false;
		private _eventClick: GlobalCallbacks.Generic;
		private _eventKeypress: GlobalCallbacks.Generic;
		private _eventOnMouseEnter: GlobalCallbacks.Generic;
		private _eventOnMouseLeave: GlobalCallbacks.Generic;
		private _globalEventBody: GlobalCallbacks.Generic;
		private _globalEventOpen: GlobalCallbacks.Generic;
		private _hasActiveLinks = false;
		private _hasElements = false;
		private _isActive = false;
		private _isOpen = false;
		private _submenuActiveLinksElement: HTMLElement;
		private _submenuAllLinksElement: HTMLAnchorElement[];
		private _submenuHeaderElement: HTMLElement;
		private _submenuLinksElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SubmenuConfig(configs));
		}

		// Close submenu, when BodyOnCLick event is triggered
		private _bodyClickCallback(_args: string, e: MouseEvent): void {
			if (this.isBuilt && this._isOpen && this._dynamicallyOpening === false) {
				if (!this.selfElement.contains(e.target as HTMLElement)) {
					this.close();
				}

				e.preventDefault();
				e.stopPropagation();
			}

			//this flag _dynamiclyOpening is just needed one time per interaction
			if (this._dynamicallyOpening) {
				this._dynamicallyOpening = false;
			}
		}

		private _checkForActiveLinks(): void {
			this._submenuActiveLinksElement =
				Helper.Dom.ClassSelector(this._submenuLinksElement, Enum.CssClass.PatternActive) ||
				Helper.Dom.ClassSelector(this._submenuHeaderElement, Enum.CssClass.PatternActive);

			// Check if submenu contains elements with active class
			this._hasActiveLinks = !!this._submenuActiveLinksElement;
		}

		// Trigger the submenu at toggle behaviour
		private _clickCallback(e: MouseEvent): void {
			this._toggleSubmenu();
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

			// Open the submenu
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
				if (_closestElem === this.selfElement && this._isOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		// Trigger the submenu after an hover behaviour
		private _onMouseEnterCallback(e: MouseEvent) {
			this._show();
			e.stopPropagation();
		}

		// Close the submenu when the cursor leaves the element
		private _onMouseLeaveCallback(e: MouseEvent) {
			// Leave event is triggered each time we moved from the scope;
			// Here we are validating if we hovering any element under _selfElem
			// If we are not hovering it means that we leave the component
			if (this.selfElement.querySelector(':hover') === null) {
				this.close();
			}

			e.preventDefault();
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

		// Remove submenu as active
		private _removeActive(): void {
			if (this._isActive) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternActive);
				this._isActive = false;
			}
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			// Remove events only if has elements inside and OpenOnHover is not available
			if (this._hasElements) {
				if (this.configs.OpenOnHover === false || Helper.DeviceInfo.IsTouch) {
					this._submenuHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
					this._submenuHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeypress);
				}

				if (this.configs.OpenOnHover && Helper.DeviceInfo.IsTouch === false) {
					this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventOnMouseEnter);
					this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventOnMouseLeave);
				}
			}
			// Remove global handlers
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.SubmenuOpen, this._globalEventOpen);

			// Remove handler from Event Manager
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._globalEventBody);
		}

		// Set submenu as active
		private _setActive(): void {
			if (this._isActive === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternActive);
				this._isActive = true;
			}
		}

		// Manage Callbacks needed to show submenu on hover
		private _setOpenOnHover(): void {
			// OpenOnHover is only available for devices where the hover exists
			if (Helper.DeviceInfo.IsTouch === false) {
				if (this._hasElements) {
					this._submenuHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
					this._eventClick = undefined;

					this.selfElement.addEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventOnMouseEnter);
					this.selfElement.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventOnMouseLeave);
				}
			}
		}

		// Show submenu
		private _show(): void {
			if (this._isOpen === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternIsOpen);

				this._submenuHeaderElement.focus();
				this._isOpen = true;

				this._updateA11yProperties();
			}
		}

		// Trigger the submenu behavior based on visibility
		private _toggleSubmenu(): void {
			if (this._isOpen) {
				this.close();
			} else {
				// Trigger event to close other submenu instances
				Event.GlobalEventManager.Instance.trigger(Event.Type.SubmenuOpen, this.uniqueId);

				// Make async the method call
				Helper.AsyncInvocation(this._show.bind(this));
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

		/**
		 * Add the A11Y attributes values
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected setA11YProperties(): void {
			// Apply the default A11Y
			Helper.A11Y.AriaHasPopupTrue(this._submenuHeaderElement);
			Helper.A11Y.TabIndexTrue(this._submenuHeaderElement);
			Helper.A11Y.AriaControls(this._submenuHeaderElement, this._submenuLinksElement.id);
			Helper.A11Y.RoleButton(this._submenuHeaderElement);

			// Set the role menuitem on each link
			this._submenuAllLinksElement.forEach((item: HTMLElement) => {
				Helper.A11Y.RoleMenuItem(item);
			});

			// Method that as the initial A11Y states and to be used on parameters changed
			this._updateA11yProperties();
		}

		/**
		 * Add Pattern Events
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected setCallbacks(): void {
			// Define the callbacks that will be used
			this._eventClick = this._clickCallback.bind(this);
			this._eventKeypress = this._keypressCallback.bind(this);
			this._globalEventOpen = this._openCallback.bind(this);
			this._globalEventBody = this._bodyClickCallback.bind(this);
			this._eventOnMouseEnter = this._onMouseEnterCallback.bind(this);
			this._eventOnMouseLeave = this._onMouseLeaveCallback.bind(this);

			// For support reasons, the use case of adding the open class by ExtendedClass on submenu we will add the handler to close all on body click
			Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._globalEventBody);

			// Add events only if has elements inside
			if (this._hasElements) {
				// OpenOnHover is only available for devices where the hover exists
				if (this.configs.OpenOnHover === false || Helper.DeviceInfo.IsTouch) {
					this._submenuHeaderElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventClick);
				}

				this._submenuHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventKeypress);
			}

			// Add the handler to Event Manager
			Event.GlobalEventManager.Instance.addHandler(Event.Type.SubmenuOpen, this._globalEventOpen);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected setHtmlElements(): void {
			this._submenuHeaderElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternHeader);
			this._submenuLinksElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternLinks);
			this._submenuAllLinksElement = [...this._submenuLinksElement.querySelectorAll(GlobalEnum.HTMLElement.Link)];

			// Check if submenu has childs
			if (this._submenuLinksElement.children.length > 0) {
				this._hasElements = true;
			}

			// Check if submenu contains elements with active class
			Helper.AsyncInvocation(this._checkForActiveLinks.bind(this));
		}

		/**
		 * Set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected setInitialStates(): void {
			// Add active class to pattern based on links whith active state
			if (this._hasActiveLinks) {
				this._setActive();
			}

			// Add an identifier if the pattern has childs
			if (this._hasElements) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternIsDropdown);
			} else {
				Helper.Dom.Styles.AddClass(this._submenuLinksElement, Enum.CssClass.PatternIsHidden);
			}

			// In case the class modifier was added by extended class
			if (Helper.Dom.Styles.ContainsClass(this.selfElement, Enum.CssClass.PatternIsOpen) && !this._isOpen) {
				this._isOpen = true;
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			// Reassign the elements to undefined, preventing memory leaks
			this._eventClick = undefined;
			this._eventKeypress = undefined;
			this._globalEventOpen = undefined;
			this._globalEventBody = undefined;
			this._eventOnMouseEnter = undefined;
			this._eventOnMouseLeave = undefined;
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof Submenu
		 */
		protected unsetHtmlElements(): void {
			this._submenuHeaderElement = undefined;
			this._submenuLinksElement = undefined;
			this._submenuAllLinksElement = undefined;
			this._submenuActiveLinksElement = undefined;
		}

		/**
		 * Built the Submenu
		 *
		 * @memberof Submenu
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setInitialStates();

			this.setA11YProperties();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setCallbacks.bind(this));

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Submenu
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
			// Check which property changed and call respective method to update it
			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.OpenOnHover:
						this._setOpenOnHover();
						break;
				}
			}
		}

		/**
		 * Close Submenu
		 *
		 * @memberof Submenu
		 */
		public close(): void {
			if (this._isOpen) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternIsOpen);

				this._isOpen = false;
				this._dynamicallyOpening = false;

				this._updateA11yProperties();
			}
		}

		/**
		 * Destroy the Submenu
		 *
		 * @memberof Submenu
		 */
		public dispose(): void {
			// Remove event listners
			this.unsetCallbacks();

			// Remove unused HTML elements
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Public Open Submenu
		 *
		 * @memberof Submenu
		 */
		public open(): void {
			// Need to prevent the submenu will not be closed by the body click, use this flag to check.
			this._dynamicallyOpening = true;
			this._show();

			setTimeout(function () {
				if (!this._dynamiclyOpening) {
					this._dynamiclyOpening = false;
				}
			}, 500);
		}

		/**
		 * Trigger on submenu onRender, to update active state
		 *
		 * @memberof Submenu
		 */
		public updateOnRender(): void {
			if (this.isBuilt) {
				// Check if there are active elements inside
				this._checkForActiveLinks();

				if (this._hasActiveLinks && this._isActive === false) {
					this._setActive();
				} else if (this._hasActiveLinks === false && this._isActive) {
					this._removeActive();
				}
			}
		}
	}
}
