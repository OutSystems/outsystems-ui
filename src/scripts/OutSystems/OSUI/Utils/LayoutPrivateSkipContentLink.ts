// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class SkipContentLink {
		// Function that will set the link on skip content to pass on A11Y checkers
		private static _setLink(): void {
			const mainContent = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.MainContent
			);
			const skipContentLink = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.SkipContent
			);

			// Check if elements exists on DOM to prevent errors on custom layouts
			if (mainContent && skipContentLink) {
				skipContentLink.setAttribute(
					OSFramework.OSUI.GlobalEnum.HTMLAttributes.Href,
					mainContent.getAttribute(OSFramework.OSUI.GlobalEnum.HTMLAttributes.Id)
				);
			}
		}

		/**
		 * Function used to add link to skip content element
		 */
		public static Set(): void {
			this._setLink();
		}
	}
}
