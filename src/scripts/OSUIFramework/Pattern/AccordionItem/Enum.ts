// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem.Enum {
	/**
	 * AccordionItem Enum properties
	 */
	export enum Properties {
		StartsExpanded = 'StartsExpanded',
		IsDisabled = 'IsDisabled',
	}

	/**
	 * AccordionItem Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-accordion',
		PatternItem = 'osui-accordion-item',
		PatternIcon = 'osui-accordion-item__icon',
		PatternTitle = 'osui-accordion-item__title',
		PatternContent = 'osui-accordion-item__content',
		PatternPlaceholder = 'osui-accordion-item__placeholder',
		Open = 'osui-accordion-item--is-open',
		Closed = 'osui-accordion-item--is-closed',
		Expanded = 'osui-accordion-item__content--is-expanded',
		Collapsed = 'osui-accordion-item__content--is-collapsed',
		Animation = 'osui-accordion-item__content--is-animating',
		Disabled = 'osui-accordion-item--is-disabled',
		FirstItem = 'osui-accordion-item--is-first-item',
		LastItem = 'osui-accordion-item--is-last-item',
		DataExpanded = 'data-expanded',
	}
}
