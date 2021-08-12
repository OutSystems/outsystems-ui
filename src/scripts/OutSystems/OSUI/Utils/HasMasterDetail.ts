// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function used to check if has MasterDetail, this is used only for native apps
	 *
	 * @export
	 */
	export function HasMasterDetail(): void {
		console.log('HasMasterDetail as run!');

		const masterDetail: HTMLElement = document.querySelector('.split-screen-wrapper');
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (content && content.contains(masterDetail)) {
			content.classList.add('has-master-detail');
		}
	}
}
