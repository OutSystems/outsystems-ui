/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function ScrollToElement(ElementId: string, IsSmooth = true, OffSet = 0): void {
		if (ElementId) {
			const elementToScrollTo = document.getElementById(ElementId);

			if (elementToScrollTo) {
				const header = OSUIFramework.Helper.Dom.ClassSelector(document, 'header');
				const layout = OSUIFramework.Helper.Dom.ClassSelector(document, OSUIFramework.Constants.LayoutClass);

				if (layout) {
					const isFixed = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'fixed-header');

					// pull the target up from its original position, pulling it the header amount so in the end it won't be covered by the header
					// it removes the height from whatever offset you might want to remove from the top
					if (isFixed) {
						OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSUIFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-header.offsetHeight + -OffSet}px)`
						);
					} else {
						OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
							elementToScrollTo,
							OSUIFramework.GlobalEnum.InlineStyle.Transform,
							`translateY(${-OffSet}px)`
						);
					}
					OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
						elementToScrollTo,
						OSUIFramework.GlobalEnum.InlineStyle.Display,
						'block'
					);

					// timeout needs to be added as a hack for the scrollIntoView to act
					OSUIFramework.Helper.AsyncInvocation(() => {
						if (IsSmooth) {
							elementToScrollTo.scrollIntoView({
								behavior: OSUIFramework.GlobalEnum.ScrollBehavior.Smooth,
								block: 'start',
							});
						} else {
							elementToScrollTo.scrollIntoView({
								behavior: OSUIFramework.GlobalEnum.ScrollBehavior.Instant,
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
							''
						);
					});
				}
			}
		}
	}
}
