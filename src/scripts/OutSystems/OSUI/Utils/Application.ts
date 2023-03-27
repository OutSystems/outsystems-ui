// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Application {
	/**
	 * Set SideMenu and Sticky classes when the layout needs them
	 */
	export function SetExpandableExceptions(): void {
		const layout = OSFramework.OSUI.Helper.Dom.ClassSelector(
			document,
			OSFramework.OSUI.GlobalEnum.CssClassElements.Layout
		);
		const body = document.body;
		if (layout) {
			const expandableMenuBehavior = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.OSUI.GlobalEnum.CssClassElements.AsideExpandable
			);
			const isLayoutNative = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
				layout,
				OSFramework.OSUI.GlobalEnum.CssClassElements.LayoutNative
			);

			if (expandableMenuBehavior && isLayoutNative) {
				const deviceDetectionClasses =
					(OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
						body,
						OSFramework.OSUI.GlobalEnum.DeviceType.tablet
					) &&
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceOrientation.landscape
						)) ||
					OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
						body,
						OSFramework.OSUI.GlobalEnum.DeviceType.desktop
					);

				// Check device detection classes
				if (deviceDetectionClasses) {
					const isHideOnScroll = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
						layout,
						OSFramework.OSUI.GlobalEnum.CssClassElements.HeaderHideOnScroll
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
