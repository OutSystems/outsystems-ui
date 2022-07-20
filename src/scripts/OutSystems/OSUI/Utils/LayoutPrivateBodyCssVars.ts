// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class CssBodyVariables {
		// Function that will set the css variables to body element
		private static _setCssVars(): void {
			const headerContent = OSUIFramework.Helper.Dom.ClassSelector(
				document,
				OSUIFramework.GlobalEnum.CssClassElements.HeaderTopContent
			);
			const footer = OSUIFramework.Helper.Dom.ClassSelector(
				document,
				OSUIFramework.GlobalEnum.CssClassElements.Footer
			);
			const body = document.body;

			let stylesToBeAdded = '';

			if (OSUI.Utils.DeviceDetection.IsWebApp() === false) {
				if (headerContent) {
					stylesToBeAdded += `${OSUIFramework.GlobalEnum.CSSVariables.HeaderContentHeight}: ${
						headerContent.getBoundingClientRect().height
					}${OSUIFramework.GlobalEnum.Units.Pixel}`;
				}

				if (footer) {
					stylesToBeAdded +=
						stylesToBeAdded === ''
							? ''
							: '; ' +
							  `${OSUIFramework.GlobalEnum.CSSVariables.FooterHeight}: ${
									footer.getBoundingClientRect().height
							  }${OSUIFramework.GlobalEnum.Units.Pixel}`;
				}
			}

			if (
				OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.phone) ||
				OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet)
			) {
				stylesToBeAdded +=
					stylesToBeAdded === ''
						? ''
						: '; ' +
						  `${OSUIFramework.GlobalEnum.CSSVariables.ViewportHeight}: ${window.innerHeight}${OSUIFramework.GlobalEnum.Units.Pixel}`;
			}

			OSUIFramework.Helper.Dom.Attribute.Set(
				body,
				OSUIFramework.GlobalEnum.HTMLAttributes.Style,
				stylesToBeAdded
			);
		}

		/**
		 * Function used to trigger the setCss inline variables to body
		 */
		public static Set(): void {
			this._setCssVars();
		}
	}
}
