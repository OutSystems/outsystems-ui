// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		Add = 'add',
		Click = 'click',
		KeyPressed = 'keyPressed',
		Removed = 'removed',
	}

	/**
	 * SectionIndex Enum properties
	 */
	export enum Properties {
		IsFixed = 'IsFixed',
		SmoothScrolling = 'SmoothScrolling',
	}

	/**
	 * Accordion Enum for CSS Classes
	 */
	export enum CssClass {
		ActiveItem = 'osui-section-index-item--is-active',
		Pattern = 'osui-section-index',
		UsefulSticky = 'osui-section-index--is-sticky',
	}
}
