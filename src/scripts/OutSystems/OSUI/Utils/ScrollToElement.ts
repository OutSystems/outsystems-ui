/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function ScrollToElement(
		ElementId: string,
		ScrollableElement: string,
		IsSmooth = true,
		ScrollDelay?: number,
		OffSet = 0
	): void {
		if (ElementId) {
			const elementToScrollTo = document.getElementById(ElementId);

			if (elementToScrollTo) {
				const activeScreen = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.ActiveScreen
				);
				// Set element that has the scroll and where the scrollTo will be applied
				const scrollOnElement =
					ScrollableElement !== ''
						? elementToScrollTo.closest(OSFramework.Constants.Dot + ScrollableElement)
						: activeScreen;
				const scrollBehavior = IsSmooth
					? OSFramework.GlobalEnum.ScrollBehavior.Smooth
					: OSFramework.GlobalEnum.ScrollBehavior.Auto;
				let top: number;

				// Exception to be applied on custom patterns that has scrollable elements inside
				if (scrollOnElement !== activeScreen) {
					top =
						elementToScrollTo.getBoundingClientRect().top -
						scrollOnElement.getBoundingClientRect().top +
						OffSet;
				} else {
					// Set the base value to apply on scroll
					top = elementToScrollTo.getBoundingClientRect().top + OffSet;

					const isHeaderFixed = OSFramework.Helper.Dom.ClassSelector(
						document,
						OSFramework.GlobalEnum.CssClassElements.HeaderIsFixed
					);

					// if fixed header, get the header height so that in the end it won't be covered by the header
					if (isHeaderFixed) {
						const header = OSFramework.Helper.Dom.ClassSelector(
							document,
							OSFramework.GlobalEnum.CssClassElements.Header
						);

						top = -header.offsetHeight + (elementToScrollTo.getBoundingClientRect().top + OffSet);
					}
				}

				// Check if element exist to prevent errors
				if (scrollOnElement) {
					setTimeout(() => {
						scrollOnElement.scrollTo({
							top: top,
							left: 0,
							behavior: scrollBehavior,
						});
					}, ScrollDelay);
				}
			}
		}
	}
}
