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

		const masterDetail = OSFramework.OSUI.Helper.Dom.ClassSelector(document.body, 'split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(content, 'has-master-detail');
			returnOutput = true;
		}

		return returnOutput;
	}
}
