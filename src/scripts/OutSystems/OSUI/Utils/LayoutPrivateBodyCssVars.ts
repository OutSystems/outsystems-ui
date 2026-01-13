// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class CssBodyVariables {
		// Method that will check if dark mode is active
		private static _checkDarkModeStatus(callback: (isDarkMode: boolean) => void): void {
			if (typeof window !== 'undefined' && window.matchMedia) {
				// Set the media query to check for dark mode
				const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

				// Initial check, that's passed through the callback function argument
				callback(darkModeQuery.matches);

				// Listen for changes
				const listener = (event: MediaQueryListEvent) => {
					callback(event.matches);
				};

				// Add the event that will detect dark mode when it changes
				darkModeQuery.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Change, listener);
			} else {
				console.warn('Dark mode detection is not supported at this context.');
				callback(false);
			}
		}

		// Method that will check if highContrast mode is active
		private static _checkHighContrastStatus(callback: (isHighContrast: boolean) => void): void {
			if (typeof window !== 'undefined' && window.matchMedia) {
				// Set the media query to check for highContrast mode
				const highContrastModeQuery = window.matchMedia('(forced-colors: active)');

				// Initial check, that's passed through the callback function argument
				callback(highContrastModeQuery.matches);

				// Listen for changes
				const listener = (event: MediaQueryListEvent) => {
					callback(event.matches);
				};

				// Add the event that will detect highContrast mode when it changes
				highContrastModeQuery.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Change, listener);
			} else {
				console.warn('HighContrast mode detection is not supported at this context.');
				callback(false);
			}
		}

		// Method to set body css variables for a phone or tablet app
		private static _isPhoneOrTablet(): void {
			OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
				document.body,
				OSFramework.OSUI.GlobalEnum.CSSVariables.ViewportHeight,
				window.innerHeight + OSFramework.OSUI.GlobalEnum.Units.Pixel
			);
		}

		// Method that will set the css variables to body element
		private static _setCssVars(): void {
			// Ensure app is not a web app
			if (OSUI.Utils.DeviceDetection.IsWebApp() === false) {
				this._setNotWebApp();
			}

			// Check if app is running on a phone or tablet device
			if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					document.body,
					OSFramework.OSUI.GlobalEnum.DeviceType.phone
				) ||
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					document.body,
					OSFramework.OSUI.GlobalEnum.DeviceType.tablet
				)
			) {
				this._isPhoneOrTablet();
			}

			// Check if highContrast mode is active
			this._checkHighContrastStatus((isHighContrast) => {
				if (isHighContrast) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.HighContrast
					);
				} else {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.HighContrast
					);
				}
			});

			// Check if dark mode is active
			this._checkDarkModeStatus((isDarkMode) => {
				if (isDarkMode) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.DarkMode
					);
				} else {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.DarkMode
					);
				}
			});
		}

		// Method to set body css variables for non web app
		private static _setNotWebApp(): void {
			const headerContent = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderTopContent
			);
			const footer = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.Footer
			);

			if (headerContent) {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					document.body,
					OSFramework.OSUI.GlobalEnum.CSSVariables.HeaderContentHeight,
					headerContent.getBoundingClientRect().height + OSFramework.OSUI.GlobalEnum.Units.Pixel
				);
			}

			if (footer) {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					document.body,
					OSFramework.OSUI.GlobalEnum.CSSVariables.FooterHeight,
					footer.getBoundingClientRect().height + OSFramework.OSUI.GlobalEnum.Units.Pixel
				);
			}

			if (footer && footer.getBoundingClientRect().height > 0) {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					document.body,
					OSFramework.OSUI.GlobalEnum.CSSVariables.HasNoFooter,
					0
				);
			} else {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					document.body,
					OSFramework.OSUI.GlobalEnum.CSSVariables.HasNoFooter,
					1
				);
			}
		}

		/**
		 * Method that will trigger the setCss functionality
		 *
		 * @static
		 * @memberof CssBodyVariables
		 */
		public static Set(): void {
			this._setCssVars();
		}
	}
}
