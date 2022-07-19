// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function used to check if has MasterDetail, this is used only for native apps,
	 * on the DEPRECATED_LayoutReadyMobile. Removing this now would be a breaking-change
	 * and it needs to be present as long as the DEPRECATED_LayoutReadyMobile isn’t removed.
	 *
	 * @export
	 */
	export function HasMasterDetail(): boolean {
		let returnOutput = false;

		const masterDetail = OSFramework.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			OSFramework.Helper.Dom.Styles.AddClass(content, 'has-master-detail');
			returnOutput = true;
		}

		return returnOutput;
	}

	/**
	 *
	 * @param contentId
	 * @param triggerItem
	 */
	export function SetFocusBehaviour(contentId: string, triggerItem: string): void {
		// Set focus in the container
		const element = OSFramework.Helper.Dom.GetElementById(contentId);
		const isPhone = OSFramework.Helper.Dom.Styles.ContainsClass(document.body, 'phone');

		OSFramework.Helper.Dom.Attribute.Set(element, 'tabindex', '0');
		element.focus();

		if (isPhone === false) {
			// Set the properties to define the tab navigation inside the content
			const focusItemTop: HTMLElement = element
				.closest('.split-right-content')
				.querySelector('span.focus-item.top');
			OSFramework.Helper.Dom.Attribute.Set(focusItemTop, 'tabindex', '0');
			OSFramework.Helper.Dom.Attribute.Set(focusItemTop, 'focusItemId', triggerItem);

			const focusItemBottom: HTMLElement = element
				.closest('.split-right-content')
				.querySelector('span.focus-item.bottom');
			const itemChild = OSFramework.Helper.Dom.TagSelector(
				OSFramework.Helper.Dom.GetElementById(triggerItem),
				'div'
			);
			if (itemChild) {
				OSFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '0');
				OSFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'focusItemId', itemChild.id);
			} else {
				OSFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '-1');
				OSFramework.Helper.Dom.Attribute.Remove(focusItemBottom, 'focusItemId');
			}
		}
	}
}
