// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Application {
	export function SetExpandableExceptions(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(document, 'layout');
		const body = document.body;
		const isExpandable = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'aside-expandable');
		const nativeLayout = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'layout-native');
		const isTabletLandscape =
			OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'tablet') &&
			OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'landscape');
		const isDesktop = OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'desktop');
		const isHideOnScroll = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'hide-header-on-scroll');
		if (layout && isExpandable && ((nativeLayout && isTabletLandscape) || isDesktop)) {
			Menu.ToggleSideMenu();
		}

		// Set StickyListener when HideHeaderOnScroll is used to adapt menu padding when Expandable
		if (layout && nativeLayout && isHideOnScroll && isExpandable && (isTabletLandscape || isDesktop)) {
			LayoutPrivate.SetStickyObserver();
		}
	}
}
