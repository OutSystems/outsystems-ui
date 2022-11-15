// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	// This class is to support the deprecated submenu
	// We won't create enums for the deprecated classes ('.submenu' and '.open') in order to prevent technical debt
	export abstract class CloseDeprecatedSubmenu {
		private static _checkMenuLinks: HTMLElement;
		private static _closeMenuEvent: OSFramework.GlobalCallbacks.Generic;
		private static _deprecatedSubmenuItems: NodeListOf<HTMLElement>;

		// Method to check if deprecated submenu exists
		private static _checkDeprecatedSubmenu(): void {
			// Store the active screen
			const activeScreen = document.querySelector(
				OSFramework.Constants.Dot + OSFramework.GlobalEnum.CssClassElements.ActiveScreen
			);
			// Store the HTML element based on active screen
			this._checkMenuLinks = activeScreen.querySelector(
				OSFramework.Constants.Dot + OSFramework.GlobalEnum.CssClassElements.MenuLinks
			);
			// Store the deprecated submenu items
			this._deprecatedSubmenuItems = this._checkMenuLinks.querySelectorAll(
				OSFramework.Constants.Dot + OSFramework.GlobalEnum.CssClassElements.DeprecatedSubmenu
			);
		}

		// Method attach the event to close all open deprecated submenu items
		private static _closeDeprecatedSubmenu(): void {
			if (this._deprecatedSubmenuItems.length > 0) {
				// Close all of them if contains the class open
				for (const item of this._deprecatedSubmenuItems) {
					if (item.classList.contains('open')) {
						// This method is to trigger the platform global action of deprecated submenu
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-expect-error
						item.CloseMenu();
					}
				}
			}
		}

		/**
		 * Function used to set the close deprecated submenu event
		 */
		public static Set(): void {
			// Set the variables to check if deprecated submenu exists
			this._checkDeprecatedSubmenu();

			// Remove event listener added to body, based on possible previous screen with deprectaed submenu
			this.Unset();

			if (
				this._deprecatedSubmenuItems.length > 0 &&
				OSFramework.Helper.DeviceInfo.IsDesktop &&
				!OSUI.Utils.DeviceDetection.CheckIsLayoutSide()
			) {
				// Store the event to be added to element
				this._closeMenuEvent = this._closeDeprecatedSubmenu.bind(this);

				// Add event to body
				document.body.addEventListener(OSFramework.GlobalEnum.HTMLEvent.Click, this._closeMenuEvent);
			}
		}

		/**
		 * Function used to unset the close deprecated submenu event
		 */
		public static Unset(): void {
			document.body.removeEventListener(OSFramework.GlobalEnum.HTMLEvent.Click, this._closeMenuEvent);
		}
	}
}
