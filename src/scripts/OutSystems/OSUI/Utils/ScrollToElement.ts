/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	/**
	 * Function to scroll to a given element
	 *
	 * @export
	 * @param {string} ElementId
	 * @param {boolean} [IsSmooth=true]
	 * @param {number} [OffSet=0]
	 * @param {string} [ElementParentClass]
	 * @param {number} [ScrollDelay]
	 * @return {*}  {string}
	 */
	export function ScrollToElement(
		ElementId: string,
		IsSmooth = true,
		OffSet = 0,
		ElementParentClass?: string,
		ScrollDelay?: number
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailScrollToElement,
			callback: () => {
				const elementToScrollTo = OSFramework.OSUI.Helper.Dom.GetElementById(ElementId);

				setTimeout(() => {
					if (elementToScrollTo) {
						// Selector for header fixed on Reactive templates and Native
						const isHeaderFixed =
							OSFramework.OSUI.Helper.Dom.ClassSelector(
								document,
								OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderIsFixed
							) ||
							OSFramework.OSUI.Helper.Dom.ClassSelector(
								document,
								OSFramework.OSUI.GlobalEnum.CSSSelectors.LayoutNativeHeader
							);

						// Set ios-bounce selector
						const isIosBounce = OSFramework.OSUI.Helper.Dom.ClassSelector(
							document,
							OSFramework.OSUI.GlobalEnum.CSSSelectors.IosBounceScroll
						);

						// Set the scroll behavior to be applied
						const scrollBehavior = IsSmooth
							? OSFramework.OSUI.GlobalEnum.ScrollBehavior.Smooth
							: OSFramework.OSUI.GlobalEnum.ScrollBehavior.Auto;

						// Set the default scroll HTML element
						let scrollableElement = OSFramework.OSUI.Helper.Dom.ClassSelector(
							document,
							OSFramework.OSUI.GlobalEnum.CssClassElements.ActiveScreen
						);

						// Set default scrollable html element based on ios device with bounce class applied
						if (ElementParentClass !== OSFramework.OSUI.Constants.EmptyString) {
							const isElementParentClass = elementToScrollTo.closest(
								OSFramework.OSUI.Constants.Dot + ElementParentClass
							);

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
							const header = OSFramework.OSUI.Helper.Dom.ClassSelector(
								document,
								OSFramework.OSUI.GlobalEnum.CssClassElements.Header
							);

							top = -header.offsetHeight + top;
						}

						scrollableElement.scrollTo({
							top: top,
							left: 0,
							behavior: scrollBehavior,
						});
					}
				}, ScrollDelay);
			},
		});

		return result;
	}
}
