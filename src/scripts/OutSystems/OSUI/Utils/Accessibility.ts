// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Accessibility {
	/**
	 *
	 *
	 * @export
	 * @param {string} widgetId
	 * @param {string} role
	 */
	export function SetAccessibilityRole(widgetId: string, role: string): void {
		const element = OSUIFramework.Helper.Dom.GetElementById(widgetId);

		if (element) {
			const isBlock = OSUIFramework.Helper.Dom.Attribute.Has(
				element,
				OSUIFramework.GlobalEnum.DataBlocksTag.DataBlock
			);
			if (isBlock) {
				OSUIFramework.Helper.Dom.Attribute.Set(
					element.children[0] as HTMLElement,
					OSUIFramework.Constants.A11YAttributes.Role.AttrName,
					role
				);
			} else {
				OSUIFramework.Helper.Dom.Attribute.Set(
					element,
					OSUIFramework.Constants.A11YAttributes.Role.AttrName,
					role
				);
			}
		}
	}

	export function SetAriaHidden(widgetId: string, isHidden: boolean): void {
		const elem = OSUIFramework.Helper.Dom.GetElementById(widgetId);

		if (elem) {
			OSUIFramework.Helper.Dom.Attribute.Set(elem, 'aria-hidden', isHidden);
		}
	}

	export function SetFocus(widgetId: string): void {
		const elementId = OSUIFramework.Helper.Dom.GetElementById(widgetId);

		if (elementId) {
			elementId.focus();
		}
	}

	export function SetLang(lang: string): void {
		const hasLangAttribute = document.documentElement.lang !== '';

		if (hasLangAttribute === false && lang !== '') {
			document.documentElement.lang = lang;
		}
	}

	export function SkipToContent(targetId: string): void {
		const target = OSUIFramework.Helper.Dom.GetElementById(targetId);

		if (target) {
			const isFocusable = OSUIFramework.Helper.Dom.Attribute.Get(target, 'tabindex');

			if (isFocusable === null) {
				OSUIFramework.Helper.Dom.Attribute.Set(target, 'tabindex', '0');
				target.focus();
				OSUIFramework.Helper.Dom.Attribute.Remove(target, 'tabindex');
			} else {
				target.focus();
			}
		}
	}

	export function ToggleTextSpacing(): void {
		let spacingStyles = OSUIFramework.Helper.Dom.ClassSelector(document, 'acessibility-style-tag');

		if (spacingStyles === undefined) {
			spacingStyles = document.createElement('style');
			OSUIFramework.Helper.Dom.Styles.AddClass(spacingStyles, 'acessibility-style-tag');
			spacingStyles.textContent =
				' * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; } ';
			OSUIFramework.Helper.Dom.Move(spacingStyles, document.head);
		} else if (spacingStyles) {
			spacingStyles.remove();
		}
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function WCAGMetaTag(): void {
		OSUIFramework.Helper.Dom.Attribute.Set(
			OSUIFramework.Helper.Dom.TagSelector(document.head, '[name="viewport"]'),
			'content',
			'viewport-fit=cover, width=device-width, initial-scale=1'
		);
	}
}
