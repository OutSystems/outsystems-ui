// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Application {
	/**
	 * Set SideMenu and Sticky classes when the layout needs them
	 */
	export function SetExpandableExceptions(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(document, OSUIFramework.Constants.LayoutClass);
		const body = document.body;
		if (layout) {
			const expandableMenuBehavior = OSUIFramework.Helper.Dom.Styles.ContainsClass(
				layout,
				OSUIFramework.GlobalEnum.CssClassElements.AsideExpandable
			);
			const isLayoutNative = OSUIFramework.Helper.Dom.Styles.ContainsClass(
				layout,
				OSUIFramework.GlobalEnum.CssClassElements.LayoutNative
			);

			if (expandableMenuBehavior && isLayoutNative) {
				const deviceDetectionClasses =
					(OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet) &&
						OSUIFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSUIFramework.GlobalEnum.DeviceOrientation.landscape
						)) ||
					OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.desktop);

				// Check device detection classes
				if (deviceDetectionClasses) {
					const isHideOnScroll = OSUIFramework.Helper.Dom.Styles.ContainsClass(
						layout,
						OSUIFramework.GlobalEnum.CssClassElements.HeaderHideOnScroll
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
