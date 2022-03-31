/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	/**
	 * timeout needs to be added as a hack for the scrollIntoView to act
	 *
	 */
	function scroll(elementToScrollTo: HTMLElement, IsSmooth: boolean): void {
		if (IsSmooth) {
			elementToScrollTo.scrollIntoView({
				behavior: OSUIFramework.GlobalEnum.ScrollBehavior.Smooth,
				block: 'start',
			});
		} else {
			elementToScrollTo.scrollIntoView({
				behavior: OSUIFramework.GlobalEnum.ScrollBehavior.Auto,
				block: 'start',
			});
		}

		// reset to the original position
		OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
			elementToScrollTo,
			OSUIFramework.GlobalEnum.InlineStyle.Transform,
			''
		);
		OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
			elementToScrollTo,
			OSUIFramework.GlobalEnum.InlineStyle.Display,
			OSUIFramework.GlobalEnum.InlineStyleValue.Display.unset
		);
	}

	export function ScrollToElement(ElementId: string, IsSmooth = true, OffSet = 0): void {
		if (ElementId) {
			const elementToScrollTo = document.getElementById(ElementId);

			if (elementToScrollTo) {
				const header = OSUIFramework.Helper.Dom.ClassSelector(document, OSUIFramework.Constants.HeaderClass);
				const layout = OSUIFramework.Helper.Dom.ClassSelector(document, OSUIFramework.Constants.LayoutClass);

				if (layout) {
					const isFixed = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'fixed-header');

					// pull the target up from its original position, pulling it the header amount so in the end it won't be covered by the header
					// it removes the height from whatever offset you might want to remove from the top
					if (isFixed) {
						OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSUIFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-header.offsetHeight + -OffSet}${OSUIFramework.GlobalEnum.Units.Pixel})`
						);
					} else {
						OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSUIFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-OffSet}${OSUIFramework.GlobalEnum.Units.Pixel})`
						);
					}
					OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
						elementToScrollTo,
						OSUIFramework.GlobalEnum.InlineStyle.Display,
						OSUIFramework.GlobalEnum.InlineStyleValue.Display.block
					);

					// timeout needs to be added as a hack for the scrollIntoView to act
					OSUIFramework.Helper.AsyncInvocation(scroll, elementToScrollTo, IsSmooth);
				}
			}
		}
	}
}
