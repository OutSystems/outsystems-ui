/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Menu {
	const enum menuCssClasses {
		animate = 'menu-animatable',
		appContainer = 'app-menu-container',
		appContent = 'app-menu-content',
		background = 'menu-background',
		icon = 'menu-icon',
		menu = 'menu',
		visible = 'menu-visible',
	}

	export function Hide(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(
			document,
			OSUIFramework.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			OSUIFramework.Helper.Dom.Styles.RemoveClass(layout, menuCssClasses.visible);

			const menuIcon = OSUIFramework.Helper.Dom.ClassSelector(document, menuCssClasses.icon);
			menuIcon && menuIcon.focus();
		}
	}

	export function Show(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(
			document,
			OSUIFramework.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			OSUIFramework.Helper.Dom.Styles.AddClass(layout, menuCssClasses.visible);

			const menu = OSUIFramework.Helper.Dom.ClassSelector(document, menuCssClasses.appContent);
			menu && menu.focus();
		}
	}

	export function Toggle(): void {
		const layout = OSUIFramework.Helper.Dom.ClassSelector(
			document,
			OSUIFramework.GlobalEnum.CssClassElements.Layout
		);

		if (layout) {
			const isExpanded = OSUIFramework.Helper.Dom.Styles.ContainsClass(layout, menuCssClasses.visible);

			if (isExpanded) {
				Hide();
			} else {
				Show();
			}
		}
	}
}
