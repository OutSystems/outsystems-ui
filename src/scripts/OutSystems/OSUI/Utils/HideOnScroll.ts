// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.HideOnScroll {
	/**
	 * Function responsible to add events that will manage the header accordingly
	 *
	 * @param {HTMLElement} header
	 */
	function addEvents(header: HTMLElement) {
		const content: HTMLElement = document.querySelector('.active-screen .content');

		if (OSFramework.Helper.Dom.Styles.ContainsClass(header, 'hide') && content) {
			let startY = 0;
			const mainContentHeight: number = OSFramework.Helper.Dom.ClassSelector(
				document.body,
				'main-content'
			)?.scrollHeight;

			const threshold = 60;
			const layout = OSFramework.Helper.Dom.ClassSelector(
				document.body,
				OSFramework.GlobalEnum.CssClassElements.Layout
			);

			if (mainContentHeight - threshold > content.offsetHeight) {
				content.addEventListener(
					OSFramework.GlobalEnum.HTMLEvent.TouchStart,
					(e: TouchEvent) => {
						startY = e.touches[0].pageY;
					},
					false
				);

				content.addEventListener(
					OSFramework.GlobalEnum.HTMLEvent.TouchMove,
					(e: TouchEvent) => {
						const c: number = e.touches[0].pageY;
						const translateY: number = c - startY;

						if (c < startY - threshold && translateY < 0) {
							OSFramework.Helper.Dom.Styles.AddClass(header, 'header-on-scroll');
							OSFramework.Helper.Dom.Styles.AddClass(layout, 'header-is-hidden');
						} else if (c > startY + threshold) {
							OSFramework.Helper.Dom.Styles.RemoveClass(header, 'header-on-scroll');
							OSFramework.Helper.Dom.Styles.RemoveClass(layout, 'header-is-hidden');
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
		const header = OSFramework.Helper.Dom.ClassSelector(
			document.body,
			OSFramework.GlobalEnum.CssClassElements.Header
		);
		if (header) {
			addEvents(header);
		}
	}
}
