// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Application {
	/**
	 * Set SideMenu and Sticky classes when the layout needs them
	 */
	export function SetExpandableExceptions(): void {
		const layout = OSFramework.Helper.Dom.ClassSelector(document, OSFramework.GlobalEnum.CssClassElements.Layout);
		const body = document.body;
		if (layout) {
			const expandableMenuBehavior = OSFramework.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.GlobalEnum.CssClassElements.AsideExpandable
			);
			const isLayoutNative = OSFramework.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.GlobalEnum.CssClassElements.LayoutNative
			);

			if (expandableMenuBehavior && isLayoutNative) {
				const deviceDetectionClasses =
					(OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.tablet) &&
						OSFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.GlobalEnum.DeviceOrientation.landscape
						)) ||
					OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.desktop);

				// Check device detection classes
				if (deviceDetectionClasses) {
					const isHideOnScroll = OSFramework.Helper.Dom.Styles.ContainsClass(
						layout,
						OSFramework.GlobalEnum.CssClassElements.HeaderHideOnScroll
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
