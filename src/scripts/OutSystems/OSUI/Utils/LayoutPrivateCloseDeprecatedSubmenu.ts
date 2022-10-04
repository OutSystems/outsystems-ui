// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	// This class is to support the deprecated submenu
	// We won't create enums for the deprecated classes ('.submenu' and '.open') in order to prevent technical debt
	export abstract class CloseDeprecatedSubmenu {
		private static _checkMenuLinks: HTMLElement;
		private static _closeMenuEvent: OSFramework.GlobalCallbacks.Generic;

		private static _closeDeprecatedSubmenu(): void {
			if (this._checkMenuLinks !== undefined) {
				const subItems = this._checkMenuLinks.querySelectorAll('.active-screen.screen-container .submenu');

				if (subItems.length > 0) {
					// Close all of them if contains the class open
					subItems.forEach((item) => {
						if (item.classList.contains('open')) {
							// This method is to trigger the platform global action of deprecated submenu
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							//@ts-expect-error
							item.CloseMenu();
						}
					});
				}
			}
		}

		/**
		 * Function used to set the close deprecated submenu event
		 */
		public static Set(): void {
			// Store the HTML element
			this._checkMenuLinks = document.querySelector(
				OSFramework.Constants.Dot + OSFramework.GlobalEnum.CssClassElements.MenuLinks
			);
			// Store the event to be added to element
			this._closeMenuEvent = this._closeDeprecatedSubmenu.bind(this);

			if (
				OSFramework.Helper.DeviceInfo.IsDesktop &&
				!OSUI.Utils.DeviceDetection.CheckIsLayoutSide() &&
				this._checkMenuLinks
			) {
				document.body.addEventListener(OSFramework.GlobalEnum.HTMLEvent.Click, this._closeMenuEvent);
			}
		}

		/**
		 * Function used to unset the close deprecated submenu event
		 */
		public static Unset(): void {
			if (
				OSFramework.Helper.DeviceInfo.IsDesktop &&
				!OSUI.Utils.DeviceDetection.CheckIsLayoutSide() &&
				this._checkMenuLinks
			) {
				document.body.removeEventListener(OSFramework.GlobalEnum.HTMLEvent.Click, this._closeMenuEvent);

				// Unset the callback added to element
				this._closeMenuEvent = undefined;
			}
		}
	}
}
