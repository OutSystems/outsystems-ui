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
			// Selector for header fixed on Reactive templates and Native
			const isHeaderFixed =
				OSFramework.Helper.Dom.ClassSelector(document, OSFramework.GlobalEnum.CssClassElements.HeaderIsFixed) ||
				OSFramework.Helper.Dom.ClassSelector(document, OSFramework.GlobalEnum.CSSSelectors.LayoutNativeHeader);

			// Set ios-bounce selector
			const isIosBounce = OSFramework.Helper.Dom.ClassSelector(
				document,
				OSFramework.GlobalEnum.CSSSelectors.IosBounceScroll
			);

			// Set the scroll behavior to be applied
			const scrollBehavior = IsSmooth
				? OSFramework.GlobalEnum.ScrollBehavior.Smooth
				: OSFramework.GlobalEnum.ScrollBehavior.Auto;

			// Set the default scroll HTML element
			let scrollableElement = OSFramework.Helper.Dom.ClassSelector(
				document,
				OSFramework.GlobalEnum.CssClassElements.ActiveScreen
			);

			// Set default scrollable html element based on ios device with bounce class applied
			if (ElementParentClass !== OSFramework.Constants.EmptyString) {
				const isElementParentClass = elementToScrollTo.closest(OSFramework.Constants.Dot + ElementParentClass);

				if (isElementParentClass) {
					scrollableElement = isElementParentClass as HTMLElement;
				} else {
					console.warn(`The element with class '${ElementParentClass}' doesn't exist on DOM.`);
				}
			} else if (isIosBounce) {
				scrollableElement = isIosBounce;
			}

			// Set the base value to apply on scroll, calculating the difference between the current scroll position and element to scroll
			let top = scrollableElement.scrollTop + elementToScrollTo.getBoundingClientRect().top + OffSet;

			// If fixed header, get the header height so that in the end it won't be covered by the header
			if (isHeaderFixed) {
				const header = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.Header
				);

				top = -header.offsetHeight + top;
			}

			// Check if element exist to prevent errors
			setTimeout(() => {
				scrollableElement.scrollTo({
					top: top,
					left: 0,
					behavior: scrollBehavior,
				});
			}, ScrollDelay);
		}
	}
}
