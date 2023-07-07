// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.ButtonLoading.Enum {
	/**
	 * ButtonLoading Enum properties
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Properties {
		IsLoading = 'IsLoading',
		ShowLoadingAndLabel = 'ShowLoadingAndLabel',
	}

	/**
	 * ButtonLoading Enum Css Classes
	 *
	 * @export
	 * @enum {number}
	 */
	export enum CssClass {
		Button = 'btn',
		IsLoading = 'osui-btn-loading--is-loading',
		ShowSpinnerOnly = 'osui-btn-loading-show-spinner',
		Spinner = 'osui-btn-loading__spinner-animation',
	}
}
