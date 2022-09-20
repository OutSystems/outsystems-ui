/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Utils {
	export function ScrollToElement(ElementId: string, IsSmooth = true, OffSet = 0): void {
		if (ElementId) {
			const elementToScrollTo = document.getElementById(ElementId);

			if (elementToScrollTo) {
				// The app element that has the scroll and where the scrollTo wiull be applied
				const activeScreen = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.ActiveScreen
				);

				const header = OSFramework.Helper.Dom.ClassSelector(
					document,
					OSFramework.GlobalEnum.CssClassElements.Header
				);

				if (header) {
					let top: number;
					const scrollBehavior = IsSmooth
						? OSFramework.GlobalEnum.ScrollBehavior.Smooth
						: OSFramework.GlobalEnum.ScrollBehavior.Auto;

					const isHeaderFixed = OSFramework.Helper.Dom.ClassSelector(
						document,
						OSFramework.GlobalEnum.CssClassElements.HeaderIsFixed
					);

					// if fixed header, get the header height so that in the end it won't be covered by the header
					if (isHeaderFixed) {
						top = -header.offsetHeight + (elementToScrollTo.getBoundingClientRect().top + OffSet);
					} else {
						top = elementToScrollTo.getBoundingClientRect().top + OffSet;
					}

					if (activeScreen) {
						activeScreen.scrollTo({
							top: top,
							left: 0,
							behavior: scrollBehavior,
						});
					}
				}
			}
		}
	}
}
