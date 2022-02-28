// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem.Enum {
	/**
	 * AccordionItem Enum properties
	 */
	export enum Properties {
		StartsExpanded = 'StartsExpanded',
		IsDisabled = 'IsDisabled',
		Icon = 'Icon',
	}

	/**
	 * AccordionItem Enum for CSS Classes
	 */
	export enum CssClass {
		PatternIcon = 'osui-accordion-item__icon',
		PatternIconCaret = 'osui-accordion-item__icon--caret',
		PatternIconPlusMinus = 'osui-accordion-item__icon--plus-minus',
		PatternIconCustom = 'osui-accordion-item__icon--custom',
		PatternTitle = 'osui-accordion-item__title',
		PatternContent = 'osui-accordion-item__content',
		PatternOpen = 'osui-accordion-item--is-open',
		PatternClosed = 'osui-accordion-item--is-closed',
		PatternExpanded = 'osui-accordion-item__content--is-expanded',
		PatternCollapsed = 'osui-accordion-item__content--is-collapsed',
		PatternAnimating = 'osui-accordion-item__content--is-animating',
		PatternDisabled = 'osui-accordion-item--is-disabled',
		PatternFirstItem = 'osui-accordion-item--is-first-item',
		PatternLastItem = 'osui-accordion-item--is-last-item',
	}

	export enum IconType {
		Caret = 'Caret',
		PlusMinus = 'PlusMinus',
		Custom = 'Custom',
	}
}
