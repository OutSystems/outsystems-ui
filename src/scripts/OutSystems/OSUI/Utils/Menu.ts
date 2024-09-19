// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Menu {
	// OrientationChange callback to be stored and removed on Destroy
	let _onOrientationChangeCallback: OSFramework.OSUI.GlobalCallbacks.Generic;

	// App Properties
	const _appProp = {
		device: {
			isLandscape: false,
			type: undefined as OSFramework.OSUI.GlobalEnum.DeviceType,
		},
		layout: {
			element: undefined as HTMLElement,
			isAsideExpandable: false,
			isAsideMenu: false,
			isAsideMenuOverlay: false,
			isBlank: false,
			isTopMenu: false,
		},
		menu: {
			element: undefined as HTMLElement,
			hasEventListeners: false,
			isOpen: false,
		},
	};

	// Focusable elements on the menu context since it's different from the default constant that excludes disabled elements with tabindex=-1
	const _menuFocusableElems =
		'a[href]:not([disabled]), [tabindex], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

	// Add Menu Event Listeners
	const _addMenuEeventListeners = (hasTriggeredByAPI = false): void => {
		// Ensure events will be removed when SetMenuListeners "API" has been triggered and before readding them again
		if (hasTriggeredByAPI) {
			_removeMenuEeventListeners();
		}
		// Check if the keydown event should be added
		const shouldKeyDownBeAdded =
			OSFramework.OSUI.Helper.DeviceInfo.IsDesktop === false ||
			_appProp.layout.isAsideMenuOverlay ||
			_appProp.layout.isAsideExpandable;

		if (shouldKeyDownBeAdded && _appProp.menu.hasEventListeners === false) {
			_appProp.menu.hasEventListeners = true;
			_appProp.menu.element.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.keyDown, _menuOnKeypress);
		}
	};

	// Method that add the OnResize handler
	const _addMenuOnResize = (): void => {
		OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
			OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
			_onResizeCallbackHandler
		);
	};

	const _hideMenu = (): void => {
		// Update app properties
		if (_appProp.menu.element === undefined || _appProp.layout.element === undefined) {
			_setAppProps();
		}

		const menuIcon = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'menu-icon');

		_appProp.layout.element.classList.remove('menu-visible');
		_appProp.menu.isOpen = false;
		menuIcon?.focus();

		_updatePropsAndAttrs();
	};

	// Menu on keypress handler
	const _menuOnKeypress = function (e: KeyboardEvent) {
		const isTabPressed = e.key === 'Tab';
		const isEscapedPressed = e.key === 'Escape';
		const isShiftKey = e.shiftKey;
		const focusableEls = OSFramework.OSUI.Helper.Dom.TagSelectorAll(_appProp.menu.element, _menuFocusableElems);

		const firstFocusableEl = focusableEls[0] as HTMLElement;
		const lastFocusableEl = focusableEls[focusableEls.length - 1] as HTMLElement;

		if (!isTabPressed && !isEscapedPressed) {
			return;
		}

		//If ESC, Close Menu
		if (isEscapedPressed && _appProp.menu.isOpen) {
			e.preventDefault();
			e.stopPropagation();
			_toggleMenu();
		}

		if (isShiftKey) {
			if (document.activeElement === firstFocusableEl) {
				lastFocusableEl.focus();
				e.preventDefault();
			}
		} else if (document.activeElement === lastFocusableEl) {
			firstFocusableEl.focus();
			e.preventDefault();
		}
	};

	// OrientationChange handler
	const _onOrientationChangeCallbackHandler = (callback: OSFramework.OSUI.GlobalCallbacks.Generic): void => {
		if (callback !== undefined) {
			setTimeout(function () {
				_onOrientationChangeCallback();
			}, 300);
		}
	};

	// OnResize handler
	const _onResizeCallbackHandler = (): void => {
		// Get the current device type
		const currentDeviceType = OSFramework.OSUI.Helper.DeviceInfo.GetDeviceType();

		// Check if the device type is the same as the current device type, if so, return to prevent unnecessary calls
		if (_appProp.device.type === currentDeviceType) {
			return;
		}

		// Update the device type on the app properties
		_appProp.device.type = currentDeviceType;

		// Check if the menu is open
		if (_appProp.menu.isOpen) {
			// Close the menu, internally it will update the menu attributes
			_toggleMenu();
		} else {
			// Update app properties and menu attributes
			_updatePropsAndAttrs();
		}

		// Remove the menu event listeners since device type changed
		_removeMenuEeventListeners();

		// ReAdd the menu event listeners
		_addMenuEeventListeners();
	};

	// Remove Menu Event Listeners
	const _removeMenuEeventListeners = (): void => {
		if (_appProp.menu.hasEventListeners) {
			_appProp.menu.hasEventListeners = false;
			_appProp.menu.element.removeEventListener('keydown', _menuOnKeypress);
		}
	};

	// Method that removes the OnResize handler
	const _removeMenuOnResize = (): void => {
		OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
			OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
			_onResizeCallbackHandler
		);
	};

	// Set A11Y attributes to the menu and its childrens
	const _setA11YAttributes = (menu?: HTMLElement): void => {
		// Check if the given menu is undefined
		if (menu === undefined) {
			// If so, get the menu from the appProps
			menu = _appProp.menu.element;
		}

		// Get all focusable elements inside
		const focusableEls = Array.from(menu.querySelectorAll(_menuFocusableElems));
		// Get all menu items
		const menuItems = Array.from(menu.querySelectorAll('.app-menu-links > a'));

		// Remove the elements that are inside a submenu to be manged by the submenu itself
		for (let i = 0; i < focusableEls.length; ++i) {
			if (focusableEls[i].closest('.osui-submenu__items')) {
				focusableEls.splice(i, 1);
			}
		}

		// Check if there are any menu items
		if (menuItems.length > 0) {
			// Add role menuitem to all menu direct children
			for (const item of menuItems) {
				if (!item.hasAttribute('role')) {
					item.setAttribute('role', 'menuitem');
				}
			}
		}

		// Check if the menu is open or if it's a desktop device with the aside menu overlay or expandable
		const enableA11Y =
			_appProp.menu.isOpen ||
			(OSFramework.OSUI.Helper.DeviceInfo.IsDesktop &&
				_appProp.layout.isAsideMenuOverlay === false &&
				_appProp.layout.isAsideExpandable === false);

		// Set the tabindex and aria-expanded attributes based on the enableA11Y flag
		if (enableA11Y) {
			OSFramework.OSUI.Helper.A11Y.TabIndexTrue(menu);
			OSFramework.OSUI.Helper.A11Y.AriaExpandedTrue(menu);

			for (const item of focusableEls) {
				OSFramework.OSUI.Helper.A11Y.TabIndexTrue(item as HTMLElement);
			}
		} else {
			OSFramework.OSUI.Helper.A11Y.TabIndexFalse(menu);
			OSFramework.OSUI.Helper.A11Y.AriaExpandedFalse(menu);

			for (const item of focusableEls) {
				OSFramework.OSUI.Helper.A11Y.TabIndexFalse(item as HTMLElement);
			}
		}
	};

	// Set the properties used to properly manage several menu behaviours
	const _setAppProps = (): void => {
		_appProp.menu.element =
			OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'app-menu-content') ||
			OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'app-menu-container');

		_appProp.layout.element = OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'layout');

		_appProp.device.type = OSFramework.OSUI.Helper.DeviceInfo.GetDeviceType();

		_appProp.device.isLandscape =
			OSFramework.OSUI.Helper.DeviceInfo.GetDeviceOrientation() ===
			OSFramework.OSUI.GlobalEnum.DeviceOrientation.landscape;

		_appProp.menu.isOpen = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'menu-visible'
		);

		_appProp.layout.isTopMenu = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'layout-top'
		);

		_appProp.layout.isAsideMenu = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'aside-visible'
		);

		_appProp.layout.isAsideMenuOverlay = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'aside-overlay'
		);

		_appProp.layout.isBlank = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'layout-blank'
		);

		_appProp.layout.isAsideExpandable = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
			_appProp.layout.element,
			'aside-expandable'
		);
	};

	// Method that will make menu visible
	const _showMenu = (): void => {
		// Check if the menu should be shown
		const shouldShowMenu =
			OSFramework.OSUI.Helper.DeviceInfo.IsDesktop === false ||
			_appProp.layout.isAsideMenuOverlay ||
			_appProp.layout.isAsideExpandable;

		// If not, prevent menu to be shown
		if (shouldShowMenu === false) {
			return;
		}

		// Update app properties
		if (_appProp.menu.element === undefined || _appProp.layout.element === undefined) {
			_setAppProps();
		}

		_appProp.layout.element.classList.add('menu-visible');
		_appProp.menu.element.focus();
		_appProp.menu.isOpen = true;

		_updatePropsAndAttrs();
	};

	// Method that toggles the menu visibility
	const _toggleMenu = (): void => {
		if (_appProp.menu.isOpen) {
			_hideMenu();
		} else {
			_showMenu();
		}
	};

	// Update the app properties and attributes of the menu
	const _updatePropsAndAttrs = (): void => {
		_setAppProps();
		_setA11YAttributes();
	};

	/**
	 * Method that add the OrientationChange handler, used only for TabletApps (Template_TabletApp > Menu)
	 *
	 * @export
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 */
	export function AddMenuOnOrientationChange(callback: OSFramework.OSUI.GlobalCallbacks.Generic): void {
		if (callback !== undefined) {
			_onOrientationChangeCallback = callback;
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.OrientationChange,
				_onOrientationChangeCallbackHandler
			);
		}
	}

	/**
	 * Checks if the menu can be draggable
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function IsMenuDraggable(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailCheckIsMenuDraggable,
			hasValue: true,
			callback: () => {
				// Update appProperties
				_setAppProps();

				const _layoutSideMenuVisible = _appProp.layout.isAsideMenu;

				let _addDragGestures = false;

				if (window.cordova !== undefined && DeviceDetection.IsRunningAsPWA() === false) {
					if (
						(_layoutSideMenuVisible && OSFramework.OSUI.Helper.DeviceInfo.IsDesktop) ||
						(_layoutSideMenuVisible &&
							OSFramework.OSUI.Helper.DeviceInfo.IsTablet &&
							_appProp.device.isLandscape)
					) {
						_addDragGestures = false;
					} else {
						_addDragGestures = true;
					}
				}

				return _addDragGestures;
			},
		});

		return result;
	}

	/**
	 * Closes the extended menu content
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function MenuHide(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetExtendedMenuHide,
			callback: () => {
				/**
				 * Get a deprecated menu element
				 *
				 * 	This can be present at older versions of the Layouts
				 *
				 * @deprecated
				 */
				const deprecatedMenu = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'menu');
				if (deprecatedMenu) {
					const appMenu = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'app-menu-container');
					const menuOverlay = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'menu-background');

					const onTransitionEnd = () => {
						OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(deprecatedMenu, 'menu--animatable');
						deprecatedMenu.removeEventListener('transitionend', onTransitionEnd);
					};

					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(deprecatedMenu, 'menu--visible');

					if (menuOverlay) {
						menuOverlay.style.opacity = '';
					}

					appMenu.style.transform = '';

					deprecatedMenu.addEventListener('transitionend', onTransitionEnd, false);
				} else {
					_hideMenu();
				}

				_updatePropsAndAttrs();
			},
		});

		return result;
	}

	/**
	 * Opens the extended menu content
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function MenuShow(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetExtendedMenuShow,
			callback: () => {
				/**
				 * Get a deprecated menu element
				 *
				 * 	This can be present at older versions of the Layouts
				 *
				 * @deprecated
				 */
				const deprecatedMenu = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'menu');
				if (deprecatedMenu) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(deprecatedMenu, 'menu--visible');
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(deprecatedMenu, 'menu--animatable');

					_updatePropsAndAttrs();
				} else {
					_showMenu();
				}
			},
		});

		return result;
	}

	/**
	 * OnDestroy method that is called when the menu is destroyed
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function OnDestroy(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuOnDestroy,
			callback: () => {
				_removeMenuOnResize();
			},
		});

		return result;
	}

	/**
	 * OnReady method that is called when the menu is ready
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function OnReady(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuOnReady,
			callback: () => {
				_updatePropsAndAttrs();
				_addMenuOnResize();
			},
		});

		return result;
	}

	/**
	 * Method that removes the OrientationChange handler
	 *
	 * @export
	 */
	export function RemoveMenuOnOrientationChange(): void {
		if (_onOrientationChangeCallback !== undefined) {
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.OrientationChange,
				_onOrientationChangeCallbackHandler
			);
			_onOrientationChangeCallback = undefined;
		}
	}

	/**
	 * Adds the selected states to menu items
	 *
	 * @export
	 * @param {string} WidgetId
	 * @param {number} ActiveItem
	 * @param {number} ActiveSubItem
	 * @return {*}  {string}
	 */
	export function SetActiveMenuItems(WidgetId: string, ActiveItem: number, ActiveSubItem: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetActiveMenuItems,
			callback: () => {
				let widgetSelector = '';
				if (WidgetId !== '') {
					widgetSelector = '#' + WidgetId + ' ';
				}

				const appMenuLinks =
					OSFramework.OSUI.Helper.Dom.TagSelector(document.body, widgetSelector + '.app-menu-links') ||
					OSFramework.OSUI.Helper.Dom.TagSelector(document.body, widgetSelector + '.app-sidemenu-links');

				if (appMenuLinks) {
					const activeLinkBlock = appMenuLinks.children[ActiveItem] as HTMLElement;

					if (activeLinkBlock) {
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(activeLinkBlock, 'active');
						const activeSubMenu =
							OSFramework.OSUI.Helper.Dom.ClassSelector(activeLinkBlock, 'submenu') ||
							OSFramework.OSUI.Helper.Dom.ClassSelector(activeLinkBlock, 'osui-submenu');

						if (activeSubMenu) {
							OSFramework.OSUI.Helper.Dom.Styles.AddClass(activeSubMenu, 'active');
							const subMenuItem =
								OSFramework.OSUI.Helper.Dom.ClassSelector(activeSubMenu, 'submenu-items') ||
								OSFramework.OSUI.Helper.Dom.ClassSelector(activeSubMenu, 'osui-submenu__items');

							const activeSubMenuItem = subMenuItem.children[ActiveSubItem] as HTMLElement;
							if (activeSubMenuItem) {
								OSFramework.OSUI.Helper.Dom.Styles.AddClass(activeSubMenuItem, 'active');
							}
						}
					}
				}
			},
		});

		return result;
	}

	/**
	 * Use this action on a BottomBar block to set an active state to a BottomBarItem
	 * Used by default on the BottomBar block inside the OutSystems UI Mobile Templates
	 *
	 * @export
	 * @param {*} [ActiveItem=-1]
	 * @return {*}  {string}
	 */
	export function SetBottomBarActiveElement(ActiveItem = -1): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetBottomBarActiveElement,
			callback: () => {
				const bottomBar = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'bottom-bar');
				const bottomBarChild = (bottomBar ? bottomBar.children[ActiveItem] : undefined) as HTMLElement;

				if (bottomBar && bottomBarChild) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(bottomBarChild, 'active');
				}
			},
		});

		return result;
	}

	/**
	 * Supports the items accessible on the menu
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function SetMenuAttributes(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuAttributes,
			callback: () => {
				if (_appProp.menu.element === undefined) {
					_setAppProps();
				}

				_setA11YAttributes();
			},
		});

		return result;
	}

	/**
	 * Changes the menu icon automatic behavior
	 *
	 * @export
	 * @param {string} MenuAction
	 * @return {*}  {string}
	 */
	export function SetMenuIcon(MenuAction: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuIcon,
			callback: () => {
				if (MenuAction === 'Auto') {
					const appMenu = Array.prototype.slice.call(
						OSFramework.OSUI.Helper.Dom.TagSelectorAll(document, '.bottom-bar a')
					);
					const bottomBar = Array.prototype.slice.call(
						OSFramework.OSUI.Helper.Dom.TagSelectorAll(document, '.app-menu a')
					);

					const links = appMenu.concat(bottomBar);

					let showMenu = false;

					for (let i = 0; i < links.length; i++) {
						/* removing platform timestamps */
						const timestampIndex = window.location.href.indexOf('_ts') - 1;
						const currentPage =
							timestampIndex > 0
								? window.location.href.substring(0, timestampIndex)
								: window.location.href;
						if (links[i].attributes['href']) {
							if (
								currentPage.indexOf(links[i].attributes['href'].value) >= 0 ||
								currentPage[currentPage.length - 1] === '/'
							) {
								showMenu = window.history ? window.history.length > 0 : true;
							}
						}
					}

					const menuIcon = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'app-menu-icon');

					if (showMenu) {
						OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(menuIcon, 'back');
					} else {
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(menuIcon, 'back');
					}
				}
			},
		});

		return result;
	}

	/**
	 * Makes the menu accessibility-ready
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function SetMenuIconListeners(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuIconListeners,
			callback: () => {
				const menuIcon = OSFramework.OSUI.Helper.Dom.ClassSelector(document, 'menu-icon');

				if (menuIcon) {
					const menuIconOnKeypress = function (e) {
						//If enter or space use the menuIcon to validate
						if (e.keyCode === 32 || e.keyCode === 13) {
							e.preventDefault();
							e.stopPropagation();
							_toggleMenu();
						}
					};

					menuIcon.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.keyDown, menuIconOnKeypress);
				}
			},
		});

		return result;
	}

	/**
	 * Makes the menu navigation accessibility-ready
	 *
	 * @export
	 * @param {string} WidgetId
	 * @return {*}  {string}
	 */
	export function SetMenuListeners(WidgetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuListeners,
			callback: () => {
				let widgetSelector = '';
				if (WidgetId !== '') {
					widgetSelector = '#' + WidgetId;
				}

				// Update app properties
				if (_appProp.menu.element === undefined || _appProp.layout.element === undefined) {
					_setAppProps();
				}
				// Get the menu based on the given widgetId
				const menu = OSFramework.OSUI.Helper.Dom.TagSelector(
					document.body,
					widgetSelector + '.app-menu-content'
				);
				// Update menu element
				_appProp.menu.element = menu;

				if (_appProp.layout.element && menu) {
					// Invoking setTimeout to schedule the callback to be run asynchronously
					setTimeout(function () {
						_addMenuEeventListeners(true);
					}, 0);
				}
			},
		});

		return result;
	}

	/**
	 * Toggles the side menu visibility
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function ToggleSideMenu(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailToggleSideMenu,
			callback: () => {
				_toggleMenu();
			},
		});

		return result;
	}
}
