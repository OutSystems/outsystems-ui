// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function used to check if has MasterDetail, this is used only for native apps
	 *
	 * @export
	 */
	//TODO: Is this function necessary?
	export function HasMasterDetail(): boolean {
		let returnOutput = false;

		const masterDetail = OSUIFramework.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			OSUIFramework.Helper.Dom.Styles.AddClass(content, 'has-master-detail');
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
		const element = OSUIFramework.Helper.Dom.GetElementById(contentId);
		const isPhone = OSUIFramework.Helper.Dom.Styles.ContainsClass(document.body, 'phone');

		OSUIFramework.Helper.Dom.Attribute.Set(element, 'tabindex', '0');
		element.focus();

		if (isPhone === false) {
			// Set the properties to define the tab navigation inside the content
			const focusItemTop: HTMLElement = element
				.closest('.split-right-content')
				.querySelector('span.focus-item.top');
			OSUIFramework.Helper.Dom.Attribute.Set(focusItemTop, 'tabindex', '0');
			OSUIFramework.Helper.Dom.Attribute.Set(focusItemTop, 'focusItemId', triggerItem);

			const focusItemBottom: HTMLElement = element
				.closest('.split-right-content')
				.querySelector('span.focus-item.bottom');
			const itemChild = OSUIFramework.Helper.Dom.TagSelector(
				OSUIFramework.Helper.Dom.GetElementById(triggerItem),
				'div'
			);
			if (itemChild) {
				OSUIFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '0');
				OSUIFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'focusItemId', itemChild.id);
			} else {
				OSUIFramework.Helper.Dom.Attribute.Set(focusItemBottom, 'tabindex', '-1');
				OSUIFramework.Helper.Dom.Attribute.Remove(focusItemBottom, 'focusItemId');
			}
		}
	}
}
