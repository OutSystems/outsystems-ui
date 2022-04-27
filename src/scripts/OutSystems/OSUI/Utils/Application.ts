// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Application {
	/**
	 * Set SideMenu and Sticky classes when the layout needs them
	 */
	export function SetExpandableExceptions(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(document, 'layout');
		const body = document.body;
		if (layout) {
			const expandableMenuBehavior = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'aside-expandable');
			const isLayoutNative = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, 'layout-native');

			if (expandableMenuBehavior && isLayoutNative) {
				const deviceDetectionClasses =
					(OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'tablet') &&
						OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'landscape')) ||
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, 'desktop');

				// Check device detection classes
				if (deviceDetectionClasses) {
					const isHideOnScroll = OSUIFramework.Helper.Dom.Styles.ContainsClass(
						layout,
						'hide-header-on-scroll'
					);
					// Check if the menu is open and apply the correct menu visibility, when has Expandable behavior
					Menu.ToggleSideMenu();

					// Set StickyListener when HideHeaderOnScroll is used to adapt menu padding, when Expandable behavior
					if (isHideOnScroll) {
						LayoutPrivate.SetStickyObserver();
					}
				}
			}
		}
	}
}
