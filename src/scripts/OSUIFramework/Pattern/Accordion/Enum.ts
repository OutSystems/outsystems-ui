// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Accordion.Enum {
	/**
	 * Communication between Patterns - Notification Type
	 */
	export enum ChildNotifyActionType {
		Add = 'add',
		Click = 'click',
		Removed = 'removed',
	}
	/**
	 * Accordion Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-accordion',
		PatternFirstItem = 'osui-accordion-item--is-first-item',
		PatternLastItem = 'osui-accordion-item--is-last-item',
	}

	/**
	 * Accordion Enum properties
	 */
	export enum Properties {
		MultipleItems = 'MultipleItems',
	}
}
