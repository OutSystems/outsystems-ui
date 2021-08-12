// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.HideOnScroll {
	/**
	 * Function responsible to add events that will manage the header accordingly
	 *
	 * @param {HTMLElement} header
	 */
	function addEvents(header: HTMLElement) {
		console.log('HideOnScroll has been initialized!');

		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (header.classList.contains('hide') && content) {
			let startY = 0;
			const mainContentHeight: number = document.querySelector('.main-content').scrollHeight;
			const threshold = 60;
			const layout: HTMLElement = document.querySelector('.layout');

			if (mainContentHeight - threshold > content.offsetHeight) {
				content.addEventListener(
					'touchstart',
					function (e: TouchEvent) {
						startY = e.touches[0].pageY;
					},
					false
				);

				content.addEventListener(
					'touchmove',
					function (e: TouchEvent) {
						const c: number = e.touches[0].pageY;
						const translateY: number = c - startY;

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
