// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Animation {
	/**
	 * Class to manage the overlay opacity on a drag transition
	 *
	 * @export
	 * @abstract
	 * @class OverlayTransition
	 */
	export abstract class OverlayTransition {
		/**
		 * Set overlay opacity
		 *
		 * @static
		 * @param {HTMLElement} target
		 * @param {number} x
		 * @param {GlobalEnum.Direction} direction
		 * @param {string} size
		 * @memberof OverlayTransition
		 */
		public static Set(target: HTMLElement, x: number, direction: GlobalEnum.Direction, size: string): void {
			const isLeft = direction === GlobalEnum.Direction.Left;
			const currentOpacity = parseInt(target.style.getPropertyValue(GlobalEnum.CSSVariables.OverlayOpacity));

			const percentageBeforeDif = (Math.abs(x) * 100) / parseInt(size);
			const percentage = isLeft ? 0 + percentageBeforeDif : 100 - percentageBeforeDif;

			const newOpacity = Math.floor(percentage) / 100;

			if (currentOpacity !== newOpacity && newOpacity % 1 !== 0) {
				Helper.Dom.Styles.SetStyleAttribute(target, GlobalEnum.CSSVariables.OverlayOpacity, newOpacity);
			}
		}

		/**
		 * Unset overlay opacity
		 *
		 * @static
		 * @param {HTMLElement} target
		 * @memberof OverlayTransition
		 */
		public static UnSet(target: HTMLElement): void {
			Helper.Dom.Styles.SetStyleAttribute(target, GlobalEnum.CSSVariables.OverlayOpacity, 0);
		}
	}
}
