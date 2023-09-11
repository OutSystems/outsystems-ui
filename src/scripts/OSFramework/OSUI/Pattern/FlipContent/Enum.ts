// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent.Enum {
	/**
	 * FlipContent Enum properties
	 */
	export enum Properties {
		FlipSelf = 'FlipSelf',
		IsFlipped = 'IsFlipped',
	}

	/**
	 * FlipContent Enum for CSS Classes
	 */
	export enum CssClass {
		PatternBack = 'osui-flip-content__container__back',
		PatternContainer = 'osui-flip-content__container',
		PatternDataFlipped = 'data-flipped',
		PatternFlipSelf = 'osui-flip-content--flip-self',
		PatternFront = 'osui-flip-content__container__front',
		PatternIsFlipped = 'osui-flip-content--flipped',
	}

	/**
	 * Callbacks eventName
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}
}
