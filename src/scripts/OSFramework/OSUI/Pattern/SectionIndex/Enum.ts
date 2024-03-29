// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndex.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		Active = 'active',
		Add = 'add',
		Click = 'click',
		KeyPressed = 'keyPressed',
		Inactive = 'unactive',
		Removed = 'removed',
	}

	/**
	 * CSS Classes Enum
	 */
	export enum CssClass {
		IsActiveItem = 'osui-section-index-item--is-active',
		IsSticky = 'osui-section-index--is-sticky',
		Pattern = 'osui-section-index',
	}

	/**
	 * CSS Variables Enum
	 */
	export enum CssVariable {
		TopPosition = '--top-position',
	}

	/**
	 * Properties Enum
	 */
	export enum Properties {
		IsFixed = 'IsFixed',
		SmoothScrolling = 'SmoothScrolling',
	}
}
