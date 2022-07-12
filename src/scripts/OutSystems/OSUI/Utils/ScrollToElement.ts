/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	/**
	 * timeout needs to be added as a hack for the scrollIntoView to act
	 *
	 */
	function scroll(elementToScrollTo: HTMLElement, IsSmooth: boolean): void {
		if (IsSmooth) {
			elementToScrollTo.scrollIntoView({
				behavior: OSFramework.GlobalEnum.ScrollBehavior.Smooth,
				block: 'start',
			});
		} else {
			elementToScrollTo.scrollIntoView({
				behavior: OSFramework.GlobalEnum.ScrollBehavior.Auto,
				block: 'start',
			});
		}

		// reset to the original position
		OSFramework.Helper.Dom.Styles.SetStyleAttribute(
			elementToScrollTo,
			OSFramework.GlobalEnum.InlineStyle.Transform,
			''
		);
		OSFramework.Helper.Dom.Styles.SetStyleAttribute(
			elementToScrollTo,
			OSFramework.GlobalEnum.InlineStyle.Display,
			OSFramework.GlobalEnum.InlineStyleValue.Display.unset
		);
	}

	export function ScrollToElement(ElementId: string, IsSmooth = true, OffSet = 0): void {
		if (ElementId) {
			const elementToScrollTo = document.getElementById(ElementId);

			if (elementToScrollTo) {
				const header = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.Header
				);
				const layout = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.Layout
				);

				if (layout) {
					const isFixed = OSFramework.Helper.Dom.Styles.ContainsClass(layout, 'fixed-header');

					// pull the target up from its original position, pulling it the header amount so in the end it won't be covered by the header
					// it removes the height from whatever offset you might want to remove from the top
					if (isFixed) {
						OSFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-header.offsetHeight + -OffSet}${OSFramework.GlobalEnum.Units.Pixel})`
						);
					} else {
						OSFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-OffSet}${OSFramework.GlobalEnum.Units.Pixel})`
						);
					}
					OSFramework.Helper.Dom.Styles.SetStyleAttribute(
						elementToScrollTo,
						OSFramework.GlobalEnum.InlineStyle.Display,
						OSFramework.GlobalEnum.InlineStyleValue.Display.block
					);

					// timeout needs to be added as a hack for the scrollIntoView to act
					OSFramework.Helper.AsyncInvocation(scroll, elementToScrollTo, IsSmooth);
				}
			}
		}
	}
}
