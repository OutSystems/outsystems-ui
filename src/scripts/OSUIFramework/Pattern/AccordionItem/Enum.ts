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
		Accordion = 'osui-accordion', //accordion
		AccordionItem = 'osui-accordion-item', //section-expandable
		AccordionIcon = 'osui-accordion-icon', //section-expandable-icon
		AccordionTitle = 'osui-accordion-title', //section-expandable-title
		AccordionContent = 'osui-accordion-content', //section-expandable-content
		AccordionPlaceholder = 'osui-accordion-placeholder',
		Open = 'is--open',
		Closed = 'is--closed',
		Expanded = 'is--expanded',
		Collapsed = 'is--collapsed',
		Animation = 'is--animating',
	}
}
