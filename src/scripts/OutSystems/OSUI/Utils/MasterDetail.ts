// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Used by MasterDetailSetContentFocus and MasterDetailSetContentFocus_Legacy clientActions.
	 *
	 * @param contentId Id of the detail content element
	 * @param triggerItem Id of the item that opens the detail content
	 */
	export function SetFocusBehaviour(contentId: string, triggerItem: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailMasterDetailSetContentFocus,
			callback: () => {
				// Set focus in the container
				const element = OSFramework.OSUI.Helper.Dom.GetElementById(contentId);
				const isPhone = OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(document.body, 'phone');

				OSFramework.OSUI.Helper.Dom.Attribute.Set(element, 'tabindex', '0');
				element.focus();

				if (isPhone === false) {
					// Set the properties to define the tab navigation inside the content
					const focusItemTop: HTMLElement = element
						.closest('.split-right-content')
						.querySelector('span.focus-item.top');
					OSFramework.OSUI.Helper.Dom.Attribute.Set(focusItemTop, 'tabindex', '0');
					OSFramework.OSUI.Helper.Dom.Attribute.Set(focusItemTop, 'focusItemId', triggerItem);

					const focusItemBottom: HTMLElement = element
						.closest('.split-right-content')
						.querySelector('span.focus-item.bottom');
					const itemChild = OSFramework.OSUI.Helper.Dom.TagSelector(
						OSFramework.OSUI.Helper.Dom.GetElementById(triggerItem),
						'div'
					);
					if (itemChild) {
						OSFramework.OSUI.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '0');
						OSFramework.OSUI.Helper.Dom.Attribute.Set(focusItemBottom, 'focusItemId', itemChild.id);
					} else {
						OSFramework.OSUI.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '-1');
						OSFramework.OSUI.Helper.Dom.Attribute.Remove(focusItemBottom, 'focusItemId');
					}
				}
			},
		});

		return result;
	}
}
