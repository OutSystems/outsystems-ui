// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI {
	/**
	 * Function used to Fix Inputs for iOS devices
	 *
	 * @export
	 *
	 * ToDo:
	 * 	- Check this function since this method is used at LayoutReady and LayoutReadyMobile but both of this
	 * client actions are not in use by us!
	 *  - Check the fact that webkitUserSelect prop is also deprecated!
	 */
	export function FixInputs(): void {
		console.log('FixInputs as run!');

		let originalPosition = 0;
		let currentPosition = 0;
		const content: HTMLElement = document.querySelector('.content');
		const inputs: NodeListOf<HTMLElement> = document.querySelectorAll(
			'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=image]):not([type=image]):not([type=radio]):not([type=range]):not([type=reset]):not([type=submit]), textarea'
		);

		if (inputs.length !== 0) {
			for (let i = inputs.length - 1; i >= 0; i--) {
				inputs[i].style.webkitUserSelect = 'auto';
			}

			if (content) {
				content.addEventListener('touchstart', function (e) {
					originalPosition = e.changedTouches[0].pageY;
					for (let i = inputs.length - 1; i >= 0; i--) {
						inputs[i].style.webkitUserSelect = 'auto';
					}
				});

				content.addEventListener('touchmove', function (e) {
					currentPosition = e.touches[0].pageY;
					if (Math.abs(originalPosition - currentPosition) > 10) {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'none';
						}
					} else {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'auto';
						}
					}
				});

				content.addEventListener('touchend', function (e) {
					setTimeout(function () {
						for (let i = inputs.length - 1; i >= 0; i--) {
							inputs[i].style.webkitUserSelect = 'auto';
						}
					}, 0);
				});
			}
		}
	}
}
