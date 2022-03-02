// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem.Enum {
	/**
	 * AccordionItem Enum properties
	 */
	export enum Properties {
		IconPosition = 'IconPosition',
		IsDisabled = 'IsDisabled',
		Icon = 'Icon',
		StartsExpanded = 'StartsExpanded',
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
		PatternOpen = 'osui-accordion-item--is-open',
		PatternAnimating = 'osui-accordion-item__content--is-animating',
		PatternClosed = 'osui-accordion-item--is-closed',
		PatternCollapsed = 'osui-accordion-item__content--is-collapsed',
		PatternContent = 'osui-accordion-item__content',
		PatternDisabled = 'osui-accordion-item--is-disabled',
		PatternExpanded = 'osui-accordion-item__content--is-expanded',
		PatternFirstItem = 'osui-accordion-item--is-first-item',
		PatternIconPositionIsLeft = 'osui-accordion-item__title--is-left',
		PatternIconPositionIsRight = 'osui-accordion-item__title--is-right',
		PatternLastItem = 'osui-accordion-item--is-last-item',
	}

	export enum IconType {
		Caret = 'Caret',
		PlusMinus = 'PlusMinus',
		Custom = 'Custom',
	}
}
