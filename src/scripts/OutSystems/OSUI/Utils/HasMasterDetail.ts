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
}
