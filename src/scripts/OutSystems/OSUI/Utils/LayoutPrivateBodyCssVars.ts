// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class CssBodyVariables {
		// Function that will set the css variables to body element
		private static _setCssVars(): void {
			const body = document.body;
			const headerContent = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderTopContent
			);
			const footer = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.Footer
			);

			if (OSUI.Utils.DeviceDetection.IsWebApp() === false) {
				if (headerContent) {
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						body,
						OSFramework.OSUI.GlobalEnum.CSSVariables.HeaderContentHeight,
						headerContent.getBoundingClientRect().height + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
				}

				if (footer) {
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						body,
						OSFramework.OSUI.GlobalEnum.CSSVariables.FooterHeight,
						footer.getBoundingClientRect().height + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
				}
			}

			if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(body, OSFramework.OSUI.GlobalEnum.DeviceType.phone) ||
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(body, OSFramework.OSUI.GlobalEnum.DeviceType.tablet)
			) {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					body,
					OSFramework.OSUI.GlobalEnum.CSSVariables.ViewportHeight,
					window.innerHeight + OSFramework.OSUI.GlobalEnum.Units.Pixel
				);
			}
		}

		/**
		 * Function used to trigger the setCss inline variables to body
		 */
		public static Set(): void {
			this._setCssVars();
		}
	}
}
