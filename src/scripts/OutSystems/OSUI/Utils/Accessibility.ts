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
	export function SetAccessibilityRole(widgetId: string, role: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetAccessibilityRole,
			callback: () => {
				const element = OSFramework.OSUI.Helper.Dom.GetElementById(widgetId);

				if (element) {
					const isBlock = OSFramework.OSUI.Helper.Dom.Attribute.Has(
						element,
						OSFramework.OSUI.GlobalEnum.DataBlocksTag.DataBlock
					);
					if (isBlock) {
						OSFramework.OSUI.Helper.Dom.Attribute.Set(
							element.children[0] as HTMLElement,
							OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName,
							role
						);
					} else {
						OSFramework.OSUI.Helper.Dom.Attribute.Set(
							element,
							OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName,
							role
						);
					}
				}
			},
		});

		return result;
	}

	/**
	 * Use this action to toggle the status of the aria-hidden attribute of an element.
	 * @param widgetId
	 * @param isHidden
	 */
	export function SetAriaHidden(widgetId: string, isHidden: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetAriaHidden,
			callback: () => {
				const elem = OSFramework.OSUI.Helper.Dom.GetElementById(widgetId);

				if (elem) {
					OSFramework.OSUI.Helper.A11Y.AriaHidden(elem, `${isHidden}`);
				}
			},
		});

		return result;
	}

	/**
	 * Use this action to focus the element.
	 * @param widgetId
	 */
	export function SetFocus(widgetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetFocus,
			callback: () => {
				const elementId = OSFramework.OSUI.Helper.Dom.GetElementById(widgetId);

				if (elementId) {
					elementId.focus();
				}
			},
		});

		return result;
	}

	/**
	 * Use this action to specify the language of the element's content. E.g. "en"
	 * @param lang
	 */
	export function SetLang(lang: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetLang,
			callback: () => {
				OSFramework.OSUI.Helper.Language.Set(lang);
			},
		});

		return result;
	}

	/**
	 * Action used on OutSystems UI layouts, to allow the user to skip the navigation elements on the screen, and tab directly into content.
	 * By default, the MainContentWrapper.Id is used. Use the targetId parameter to set a custom target.
	 * @param targetId
	 */
	export function SkipToContent(targetId: string): string {
		// Method to remove tabindex from skipToContent at onBlur
		function _skipToContentOnBlur(e: FocusEvent): void {
			OSFramework.OSUI.Helper.AsyncInvocation(() => {
				const target = e.target as HTMLElement;

				if (target) {
					OSFramework.OSUI.Helper.Dom.Attribute.Remove(target, 'tabindex');
					target.removeEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Blur, _skipToContentOnBlur);
				}
			});
		}

		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSkipToContent,
			callback: () => {
				const target = OSFramework.OSUI.Helper.Dom.GetElementById(targetId);

				if (target) {
					const isFocusable = OSFramework.OSUI.Helper.Dom.Attribute.Get(target, 'tabindex');

					if (isFocusable === undefined) {
						OSFramework.OSUI.Helper.Dom.Attribute.Set(target, 'tabindex', '0');
						target.focus();
						target.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Blur, _skipToContentOnBlur);
					} else {
						target.focus();
					}
				}
			},
		});

		return result;
	}

	/**
	 * Use this action to increase the letter spacing, word spacing and line-height across the application
	 */
	export function ToggleTextSpacing(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailToggleTextSpacing,
			callback: () => {
				let spacingStyles = OSFramework.OSUI.Helper.Dom.ClassSelector(
					document,
					OSFramework.OSUI.GlobalEnum.CssClassElements.AcessibilityStyleTag
				);

				if (spacingStyles === undefined) {
					spacingStyles = document.createElement('style');
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						spacingStyles,
						OSFramework.OSUI.GlobalEnum.CssClassElements.AcessibilityStyleTag
					);
					spacingStyles.textContent =
						' * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; } ';
					OSFramework.OSUI.Helper.Dom.Move(spacingStyles, document.head);
				} else if (spacingStyles) {
					spacingStyles.remove();
				}
			},
		});

		return result;
	}

	/**
	 * Adds a meta tag to your layouts.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function WCAGMetaTag(): void {
		OSFramework.OSUI.Helper.Dom.Attribute.Set(
			OSFramework.OSUI.Helper.Dom.TagSelector(document.head, '[name="viewport"]'),
			'content',
			'viewport-fit=cover, width=device-width, initial-scale=1'
		);
	}
}
