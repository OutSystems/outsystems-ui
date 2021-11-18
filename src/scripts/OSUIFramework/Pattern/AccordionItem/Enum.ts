// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.AccordionItem.Enum {
	/**
	 * AccordionItem Enum properties
	 */
	export enum Properties {
		IsExpanded = 'IsExpanded',
		IsDisabled = 'IsDisabled',
		UsePadding = 'UsePadding',
	}

	/**
	 * AccordionItem Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-accordion', //accordion
		PatternItem = 'osui-accordion-item', //section-expandable
		PatternIcon = 'osui-accordion-icon', //section-expandable-icon
		PatternTitle = 'osui-accordion-title', //section-expandable-title
		PatternContent = 'osui-accordion-content', //section-expandable-content
		PatternPlaceholder = 'osui-accordion-placeholder',
		Open = 'is--open',
		Closed = 'is--closed',
		Expanded = 'is--expanded',
		Collapsed = 'is--collapsed',
		Animation = 'is--animating',
		Disabled = 'is--disabled',
		DataExpanded = 'data-expanded',
	}
}
