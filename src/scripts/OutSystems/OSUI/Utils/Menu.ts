// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Menu {
	/**
	 * Checks if the menu can be draggable
	 * @returns
	 */
	export function IsMenuDraggable(): boolean {
		return window.cordova !== undefined && DeviceDetection.IsRunningAsPWA() === false;
	}

	/**
	 * Closes the extended menu content.
	 */
	export function MenuHide(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailMenuHide,
			callback: () => {
				const menu = OSFramework.Helper.Dom.ClassSelector(document, 'menu');
				const appMenu = OSFramework.Helper.Dom.ClassSelector(document, 'app-menu-container');
				const menuOverlay = OSFramework.Helper.Dom.ClassSelector(document, 'menu-background');

				if (menu) {
					OSFramework.Helper.Dom.Styles.RemoveClass(menu, 'menu--visible');

					if (menuOverlay) {
						menuOverlay.style.opacity = '';
					}

					appMenu.style.transform = '';

					menu.addEventListener('transitionend', OnTransitionEnd, false);
				} else {
					console.warn('The menu element is not present in the screen');
				}

				function OnTransitionEnd() {
					OSFramework.Helper.Dom.Styles.RemoveClass(menu, 'menu--animatable');

					menu.removeEventListener('transitionend', OnTransitionEnd);
				}

				SetMenuAttributes();
			},
		});

		return result;
	}

	/**
	 * Opens the extended menu content.
	 */
	export function MenuShow(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailMenuShow,
			callback: () => {
				const myMenu = OSFramework.Helper.Dom.ClassSelector(document, 'menu');

				if (myMenu) {
					OSFramework.Helper.Dom.Styles.AddClass(myMenu, 'menu--visible');
					OSFramework.Helper.Dom.Styles.AddClass(myMenu, 'menu--animatable');

					SetMenuAttributes();
				} else {
					console.warn('The menu element is not present in the screen');
				}
			},
		});

		return result;
	}

	/**
	 * Adds the selected states to menu items.
	 * @param WidgetId
	 * @param ActiveItem
	 * @param ActiveSubItem
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
					OSFramework.Helper.Dom.TagSelector(document.body, widgetSelector + '.app-menu-links') ||
					OSFramework.Helper.Dom.TagSelector(document.body, widgetSelector + '.app-sidemenu-links');

				if (appMenuLinks) {
					const activeLinkBlock = appMenuLinks.children[ActiveItem] as HTMLElement;

					if (activeLinkBlock) {
						OSFramework.Helper.Dom.Styles.AddClass(activeLinkBlock, 'active');
						const activeSubMenu =
							OSFramework.Helper.Dom.ClassSelector(activeLinkBlock, 'submenu') ||
							OSFramework.Helper.Dom.ClassSelector(activeLinkBlock, 'osui-submenu');

						if (activeSubMenu) {
							OSFramework.Helper.Dom.Styles.AddClass(activeSubMenu, 'active');
							const subMenuItem =
								OSFramework.Helper.Dom.ClassSelector(activeSubMenu, 'submenu-items') ||
								OSFramework.Helper.Dom.ClassSelector(activeSubMenu, 'osui-submenu__items');

							const activeSubMenuItem = subMenuItem.children[ActiveSubItem] as HTMLElement;
							if (activeSubMenuItem) {
								OSFramework.Helper.Dom.Styles.AddClass(activeSubMenuItem, 'active');
							}
						}
					}
				}
			},
		});

		return result;
	}

	/**
	 * Use this action on a BottomBar block to set an active state to a BottomBarItem.
	 * Used by default on the BottomBar block inside the OutSystems UI Mobile Templates.
	 * @param ActiveItem
	 */
	export function SetBottomBarActiveElement(ActiveItem = -1): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetBottomBarActiveElement,
			callback: () => {
				const bottomBar = OSFramework.Helper.Dom.ClassSelector(document, 'bottom-bar');
				const bottomBarChild = (bottomBar ? bottomBar.children[ActiveItem] : undefined) as HTMLElement;

				if (bottomBar && bottomBarChild) {
					OSFramework.Helper.Dom.Styles.AddClass(bottomBarChild, 'active');
				}
			},
		});

		return result;
	}

	/**
	 * Supports the items accessible on the menu.
	 */
	export function SetMenuAttributes(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuAttributes,
			callback: () => {
				const layout = OSFramework.Helper.Dom.ClassSelector(document, 'layout');
				const menu =
					OSFramework.Helper.Dom.ClassSelector(document, 'app-menu-content') ||
					OSFramework.Helper.Dom.ClassSelector(document, 'app-menu-container');
				const isExpanded =
					OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'menu-visible') ||
					OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'menu--visible');

				if (menu) {
					let focusableEls = menu.querySelectorAll(OSFramework.Constants.FocusableElems);
					focusableEls = [].slice.call(focusableEls);
					if (isExpanded) {
						menu.setAttribute('tabindex', '0');
						menu.setAttribute('aria-expanded', 'true');
					} else {
						menu.setAttribute('tabindex', '-1');
						menu.setAttribute('aria-expanded', 'false');
					}

					// Toggle tabindex value if Menu is closed or open
					if (isExpanded) {
						// apply tabindex = -1 by default to disable the navigation inside the sidebar when is hidden
						focusableEls.forEach(function (item) {
							item.setAttribute('tabindex', '0');
						});
					} else {
						focusableEls.forEach(function (item) {
							item.setAttribute('tabindex', '-1');
						});
					}
				}
			},
		});

		return result;
	}

	/**
	 * Changes the menu icon automatic behavior.
	 * @param MenuAction
	 */
	export function SetMenuIcon(MenuAction: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuIcon,
			callback: () => {
				if (MenuAction === 'Auto') {
					const appMenu = Array.prototype.slice.call(
						OSFramework.Helper.Dom.TagSelectorAll(document, '.bottom-bar a')
					);
					const bottomBar = Array.prototype.slice.call(
						OSFramework.Helper.Dom.TagSelectorAll(document, '.app-menu a')
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

					const menuIcon = OSFramework.Helper.Dom.ClassSelector(document, 'app-menu-icon');

					if (showMenu) {
						OSFramework.Helper.Dom.Styles.RemoveClass(menuIcon, 'back');
					} else {
						OSFramework.Helper.Dom.Styles.AddClass(menuIcon, 'back');
					}
				}
			},
		});

		return result;
	}

	/**
	 * Makes the menu accessibility-ready.
	 */
	export function SetMenuIconListeners(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuIconListeners,
			callback: () => {
				const menuIcon = OSFramework.Helper.Dom.ClassSelector(document, 'menu-icon');

				if (menuIcon) {
					const menuIconOnKeypress = function (e) {
						//If enter or space use the menuIcon to validate
						if (e.keyCode === '32' || e.keyCode === '13') {
							e.preventDefault();
							e.stopPropagation();
							ToggleSideMenu();
						}
					};

					menuIcon.addEventListener('keydown', menuIconOnKeypress);
				}
			},
		});

		return result;
	}

	/**
	 * Makes the menu navigation accessibility-ready.
	 * @param WidgetId
	 */
	export function SetMenuListeners(WidgetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetMenuListeners,
			callback: () => {
				let widgetSelector = '';
				if (WidgetId !== '') {
					widgetSelector = '#' + WidgetId;
				}

				const layout = OSFramework.Helper.Dom.ClassSelector(document, 'layout');
				const menu = OSFramework.Helper.Dom.TagSelector(document.body, widgetSelector + '.app-menu-content');

				if (layout && menu) {
					let isTopMenuMobile;
					let isVisibleMobile;
					let isExpanded = OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'menu-visible');
					const isOverlay = OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'aside-overlay');
					const isExpandable = OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'aside-expandable');

					const menuOnKeypress = function (e) {
						const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
						const isEscapedPressed = e.key === 'Escape' || e.keyCode === 27;
						const isShiftKey = e.shiftKey;
						const focusableEls = OSFramework.Helper.Dom.TagSelectorAll(
							menu,
							OSFramework.Constants.FocusableElems
						);

						const firstFocusableEl = focusableEls[0] as HTMLElement;
						const lastFocusableEl = focusableEls[focusableEls.length - 1] as HTMLElement;
						const isExpandableDesktop =
							OSFramework.Helper.Dom.TagSelector(
								document.body,
								'.desktop .active-screen .layout-side.aside-expandable'
							) ||
							OSFramework.Helper.Dom.TagSelector(
								document.body,
								'.tablet.landscape .active-screen .layout-side.aside-expandable'
							);

						if (!isTabPressed && !isEscapedPressed) {
							return;
						}

						isExpanded = OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'menu-visible');

						//If esc, Close Menu
						if (isExpanded && isEscapedPressed) {
							e.preventDefault();
							e.stopPropagation();
							ToggleSideMenu();
						}

						if (!isExpandableDesktop) {
							if (isShiftKey) {
								if (document.activeElement === firstFocusableEl) {
									lastFocusableEl.focus();
									e.preventDefault();
								}
							} else if (document.activeElement === lastFocusableEl) {
								firstFocusableEl.focus();
								e.preventDefault();
							}
						}
					};

					// Invoking setTimeout to schedule the callback to be run asynchronously
					setTimeout(function () {
						isTopMenuMobile =
							OSFramework.Helper.Dom.TagSelector(document.body, '.tablet .active-screen .layout-top') ||
							OSFramework.Helper.Dom.TagSelector(document.body, '.phone .active-screen .layout-top');
						isVisibleMobile =
							OSFramework.Helper.Dom.TagSelector(
								document.body,
								'.tablet.portrait .active-screen .layout-side.aside-visible'
							) ||
							OSFramework.Helper.Dom.TagSelector(
								document.body,
								'.phone .active-screen .layout-side.aside-visible'
							);

						if (isOverlay || isExpandable || isTopMenuMobile || isVisibleMobile) {
							menu.addEventListener('keydown', menuOnKeypress);
							SetMenuAttributes();
						}
					}, 0);

					const menuLinks = OSFramework.Helper.Dom.ClassSelector(menu, 'app-menu-links');
					if (menuLinks) {
						const menuLinksChildren = menuLinks.children;

						// Add role menuitem to all links on menu
						for (let i = 0; i < menuLinksChildren.length; i++) {
							if (!menuLinksChildren[i].hasAttribute('role') && menuLinksChildren[i].tagName === 'A') {
								menuLinksChildren[i].setAttribute('role', 'menuitem');
							}
						}
					}
				}
			},
		});

		return result;
	}

	/**
	 * Expands the menu.
	 */
	export function ToggleSideMenu(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailToggleSideMenu,
			callback: () => {
				const layout = document.querySelector('.layout');
				const menu = document.querySelector('.app-menu-content') as HTMLElement;
				const menuIcon = document.querySelector('.menu-icon') as HTMLElement;

				if (layout && menu) {
					let isExpanded = layout.classList.contains('menu-visible');
					if (isExpanded && menuIcon) {
						layout.classList.remove('menu-visible');
						menuIcon.focus();
						isExpanded = false;
					} else {
						layout.classList.add('menu-visible');
						menu.focus();
						isExpanded = true;
					}

					SetMenuAttributes();
				}
			},
		});

		return result;
	}
}
