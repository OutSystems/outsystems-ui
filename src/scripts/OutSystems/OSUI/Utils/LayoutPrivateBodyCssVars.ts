// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class CssBodyVariables {
		// Function that will set the css variables to body element
		private static _setCssVars(): void {
			const headerContent = OSFramework.Helper.Dom.ClassSelector(
				document,
				OSFramework.GlobalEnum.CssClassElements.HeaderTopContent
			);
			const footer = OSFramework.Helper.Dom.ClassSelector(
				document,
				OSFramework.GlobalEnum.CssClassElements.Footer
			);
			const body = document.body;

			let stylesToBeAdded = '';

			if (OSUI.Utils.DeviceDetection.IsWebApp() === false) {
				if (headerContent) {
					stylesToBeAdded += `${OSFramework.GlobalEnum.CSSVariables.HeaderContentHeight}: ${
						headerContent.getBoundingClientRect().height
					}${OSFramework.GlobalEnum.Units.Pixel}`;
				}

				if (footer) {
					stylesToBeAdded +=
						stylesToBeAdded === ''
							? ''
							: '; ' +
							  `${OSFramework.GlobalEnum.CSSVariables.FooterHeight}: ${
									footer.getBoundingClientRect().height
							  }${OSFramework.GlobalEnum.Units.Pixel}`;
				}
			}

			if (
				OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.phone) ||
				OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.tablet)
			) {
				stylesToBeAdded +=
					stylesToBeAdded === ''
						? ''
						: '; ' +
						  `${OSFramework.GlobalEnum.CSSVariables.ViewportHeight}: ${window.innerHeight}${OSFramework.GlobalEnum.Units.Pixel}`;
			}

			OSFramework.Helper.Dom.Attribute.Set(body, OSFramework.GlobalEnum.HTMLAttributes.Style, stylesToBeAdded);
		}

		/**
		 * Function used to trigger the setCss inline variables to body
		 */
		public static Set(): void {
			this._setCssVars();
		}
	}
}
