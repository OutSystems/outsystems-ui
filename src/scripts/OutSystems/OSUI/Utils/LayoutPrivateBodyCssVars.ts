// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class CssBodyVariables {
		// Function that will check if highContrast mode is active
		private static _checHighContrastSatus(callback: (isHighContrast: boolean) => void): void {
			if (typeof window !== 'undefined' && window.matchMedia) {
				// Set the media query to check for highContrast mode
				const highContrastModeQuery = window.matchMedia('(forced-colors: active)');

				// Initial check
				callback(highContrastModeQuery.matches);

				// Listen for changes
				const listener = (event: MediaQueryListEvent) => {
					callback(event.matches);
				};

				// Add the event that will detect highContrast mode when it changes
				highContrastModeQuery.addEventListener('change', listener);
			} else {
				console.warn('HighContrast mode detection is not supported at this context.');
				callback(false);
			}
		}

		// Function that will check if dark mode is active
		private static _checkDarkModeStatus(callback: (isDarkMode: boolean) => void): void {
			if (typeof window !== 'undefined' && window.matchMedia) {
				// Set the media query to check for dark mode
				const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

				// Initial check
				callback(darkModeQuery.matches);

				// Listen for changes
				const listener = (event: MediaQueryListEvent) => {
					callback(event.matches);
				};

				// Add the event that will detect dark mode when it changes
				darkModeQuery.addEventListener('change', listener);
			} else {
				console.warn('Dark mode detection is not supported at this context.');
				callback(false);
			}
		}

		// Set body css variables for a phone or tablet app
		private static _isPhoneOrTable(): void {
			OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
				document.body,
				OSFramework.OSUI.GlobalEnum.CSSVariables.ViewportHeight,
				window.innerHeight + OSFramework.OSUI.GlobalEnum.Units.Pixel
			);
		}

		// Set body css variables for non web app
		private static _notWebApp(): void {
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
		}

		// Function that will set the css variables to body element
		private static _setCssVars(): void {
			// Enssure app is not a web app
			if (OSUI.Utils.DeviceDetection.IsWebApp() === false) {
				this._notWebApp();
			}

			// Check if device is phone or tablet
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
				this._isPhoneOrTable();
			}

			// Check if highContrast mode is active
			this._checHighContrastSatus((isHighContrast) => {
				if (isHighContrast) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.HasHighContrast
					);
				} else {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
						document.body,
						OSFramework.OSUI.GlobalEnum.CssClassElements.HasHighContrast
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

		/**
		 * Function used to trigger the setCss inline variables to body
		 */
		public static Set(): void {
			this._setCssVars();
		}
	}
}
