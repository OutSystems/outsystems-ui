// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Rating.Enum {
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
