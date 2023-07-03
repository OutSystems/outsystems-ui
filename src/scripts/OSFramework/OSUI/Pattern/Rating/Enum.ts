// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Rating/Enum.ts
namespace OSFramework.Patterns.Rating.Enum {
========
namespace OSFramework.OSUI.Patterns.Rating.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Rating/Enum.ts
	/**
	 * CSS Classes
	 */
	export enum CssClass {
		IconStates = 'icon-states',
		IsEdit = 'is-edit',
		IsHalf = 'is-half',
		RatingInput = 'rating-input',
		RatingItem = 'rating-item',
		Size = 'rating-',
		WCAGHideText = 'wcag-hide-text',
	}

	/**
	 * Callbacks eventName
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Events {
		OnSelected = 'OnSelected',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		IsEdit = 'IsEdit',
		MaxRatingScale = 100,
		MinRatingScale = 0,
		RatingScale = 'RatingScale',
		RatingValue = 'RatingValue',
		Size = 'Size',
	}
}
