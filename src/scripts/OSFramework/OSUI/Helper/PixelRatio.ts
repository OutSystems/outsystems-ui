/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Helper {
	/**
	 * Mehtod to round a value according to devicePixelRatio
	 *
	 * @export
	 * @param {number} value
	 * @return {*}  {number}
	 */
	export function GetRoundPixelRatio(value: number): number {
		const dpr = window.devicePixelRatio || 1;
		return Math.round(value * dpr) / dpr;
	}
}
