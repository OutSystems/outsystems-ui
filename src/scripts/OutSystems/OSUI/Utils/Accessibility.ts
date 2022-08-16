// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.Accessibility {
	/**
	 * Use this action to set the aria-role of an element, for better Accessibility compliance.
	 *
	 * E.g. use this action to change Alert default values for the role attribute.
	 * This action should be used only when the pattern's visibility is set to true.
	 * @param {string} widgetId
	 * @param {string} role
	 */
	export function SetAccessibilityRole(widgetId: string, role: string): void {
		const element = OSFramework.Helper.Dom.GetElementById(widgetId);

		if (element) {
			const isBlock = OSFramework.Helper.Dom.Attribute.Has(
				element,
				OSFramework.GlobalEnum.DataBlocksTag.DataBlock
			);
			if (isBlock) {
				OSFramework.Helper.Dom.Attribute.Set(
					element.children[0] as HTMLElement,
					OSFramework.Constants.A11YAttributes.Role.AttrName,
					role
				);
			} else {
				OSFramework.Helper.Dom.Attribute.Set(element, OSFramework.Constants.A11YAttributes.Role.AttrName, role);
			}
		}
	}

	/**
	 * Use this action to toggle the status of the aria-hidden attribute of an element.
	 * @param widgetId
	 * @param isHidden
	 */
	export function SetAriaHidden(widgetId: string, isHidden: boolean): void {
		const elem = OSFramework.Helper.Dom.GetElementById(widgetId);

		if (elem) {
			OSFramework.Helper.A11Y.AriaHidden(elem, `${isHidden}`);
		}
	}

	/**
	 * Use this action to focus the element.
	 * @param widgetId
	 */
	export function SetFocus(widgetId: string): void {
		const elementId = OSFramework.Helper.Dom.GetElementById(widgetId);

		if (elementId) {
			elementId.focus();
		}
	}

	/**
	 * Use this action to specify the language of the element's content. E.g. "en"
	 * @param lang
	 */
	export function SetLang(lang: string): void {
		document.documentElement.lang = lang;
		OSFramework.Helper.Language.Set(lang);
	}

	/**
	 * Action used on OutSystems UI layouts, to allow the user to skip the navigation elements on the screen, and tab directly into content.
	 * By default, the MainContentWrapper.Id is used. Use the targetId parameter to set a custom target.
	 * @param targetId
	 */
	export function SkipToContent(targetId: string): void {
		const target = OSFramework.Helper.Dom.GetElementById(targetId);

		if (target) {
			const isFocusable = OSFramework.Helper.Dom.Attribute.Get(target, 'tabindex');

			if (isFocusable === undefined) {
				OSFramework.Helper.Dom.Attribute.Set(target, 'tabindex', '0');
				target.focus();
				OSFramework.Helper.Dom.Attribute.Remove(target, 'tabindex');
			} else {
				target.focus();
			}
		}
	}

	/**
	 * Use this action to increase the letter spacing, word spacing and line-height across the application
	 */
	export function ToggleTextSpacing(): void {
		let spacingStyles = OSFramework.Helper.Dom.ClassSelector(
			document,
			OSFramework.GlobalEnum.CssClassElements.AcessibilityStyleTag
		);

		if (spacingStyles === undefined) {
			spacingStyles = document.createElement('style');
			OSFramework.Helper.Dom.Styles.AddClass(
				spacingStyles,
				OSFramework.GlobalEnum.CssClassElements.AcessibilityStyleTag
			);
			spacingStyles.textContent =
				' * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; } ';
			OSFramework.Helper.Dom.Move(spacingStyles, document.head);
		} else if (spacingStyles) {
			spacingStyles.remove();
		}
	}

	/**
	 * Adds a meta tag to your layouts.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function WCAGMetaTag(): void {
		OSFramework.Helper.Dom.Attribute.Set(
			OSFramework.Helper.Dom.TagSelector(document.head, '[name="viewport"]'),
			'content',
			'viewport-fit=cover, width=device-width, initial-scale=1'
		);
	}
}
