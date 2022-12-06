/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function ScrollToElement(
		ElementId: string,
		IsSmooth = true,
		OffSet = 0,
		ElementParentClass?: string,
		ScrollDelay?: number
	): void {
		const elementToScrollTo = document.getElementById(ElementId);

		if (elementToScrollTo) {
			// Set ios-bounce selector
			const isIosBounce = OSFramework.Helper.Dom.ClassSelector(
				document,
				OSFramework.GlobalEnum.CSSSelectors.IosBounceScroll
			);

			// Set default scrollable html element based on ios device with bounce class applied
			const screenDefaultScroll = isIosBounce
				? isIosBounce
				: OSFramework.Helper.Dom.ClassSelector(document, OSFramework.GlobalEnum.CssClassElements.ActiveScreen);

			// Set element that has the scroll and where the scrollTo will be applied
			const scrollOnElement =
				ElementParentClass !== ''
					? elementToScrollTo.closest(OSFramework.Constants.Dot + ElementParentClass)
					: screenDefaultScroll;
			const scrollBehavior = IsSmooth
				? OSFramework.GlobalEnum.ScrollBehavior.Smooth
				: OSFramework.GlobalEnum.ScrollBehavior.Auto;

			// Set the base value to apply on scroll
			let top = elementToScrollTo.getBoundingClientRect().top + OffSet;

			// Exception to be applied on custom patterns that have scrollable elements inside
			if (scrollOnElement !== screenDefaultScroll) {
				// Get the space from body and the space from element provided to the body, to get the right scroll when the element are inside of other patterns
				top =
					elementToScrollTo.getBoundingClientRect().top -
					scrollOnElement.getBoundingClientRect().top +
					OffSet;
			} else {
				// Selector for header fixed on Reactive templates and Native
				const isHeaderFixed =
					OSFramework.Helper.Dom.ClassSelector(
						document,
						OSFramework.GlobalEnum.CssClassElements.HeaderIsFixed
					) ||
					OSFramework.Helper.Dom.ClassSelector(
						document,
						OSFramework.GlobalEnum.CSSSelectors.LayoutNativeHeader
					);

				// If fixed header, get the header height so that in the end it won't be covered by the header
				if (isHeaderFixed) {
					const header = OSFramework.Helper.Dom.ClassSelector(
						document,
						OSFramework.GlobalEnum.CssClassElements.Header
					);

					top = -header.offsetHeight + (elementToScrollTo.getBoundingClientRect().top + OffSet);
				}
			}

			// Check if element exist to prevent errors
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
