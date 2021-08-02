/**
 * Namespace used to trigger the HideOnScroll behaviour, this will only be applied to native apps.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.HideOnScroll {
	/**
	 * Function responsible to add events that will manage the header accordingly
	 *
	 * @param {HTMLElement} header
	 */
	function addEvents(header: HTMLElement) {
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (header.classList.contains('hide') && content) {
			const mainContentHeight = document.querySelector('.main-content').scrollHeight;
			let startY = 0;
			const threshold = 60;
			const layout = document.querySelector('.layout');

			if (mainContentHeight - threshold > content.offsetHeight) {
				content.addEventListener(
					'touchstart',
					function (e) {
						startY = e.touches[0].pageY;
					},
					false
				);

				content.addEventListener(
					'touchmove',
					function (e) {
						const c = e.touches[0].pageY;
						const translateY = c - startY;

						if (c < startY - threshold && translateY < 0) {
							header.classList.add('header-on-scroll');
							layout.classList.add('header-is-hidden');
						} else if (c > startY + threshold) {
							header.classList.remove('header-on-scroll');
							layout.classList.remove('header-is-hidden');
						}
					},
					false
				);
			}
		}
	}

	/**
	 * Function that will initialize the process of adding the events to manage the header behaviour
	 *
	 * @export
	 */
	export function Init(): void {
		const header: HTMLElement = document.querySelector('.header');
		if (header !== null) {
			addEvents(header);
		}
	}
}
