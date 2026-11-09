import React from 'react';

export type PatternCategory =
	| 'Content'
	| 'Interaction'
	| 'Navigation'
	| 'Adaptive'
	| 'Numbers'
	| 'Utilities'
	| 'Advanced';

export type PatternEntry = {
	name: string;
	category: PatternCategory;
	blurb: string;
	/** Storybook story id, e.g. patterns-content-accordion--default */
	id: string;
};

/** Catalogue of every storied OUI pattern — blurbs are one-liners for the Welcome browser. */
export const PATTERN_CATALOGUE: PatternEntry[] = [
	// Content
	{ name: 'Accordion', category: 'Content', blurb: 'Stacked sections that expand on click.', id: 'patterns-content-accordion--default' },
	{ name: 'Alert', category: 'Content', blurb: 'Inline status message with a severity tone.', id: 'patterns-content-alert--default' },
	{ name: 'BlankSlate', category: 'Content', blurb: 'Empty-state placeholder with optional action.', id: 'patterns-content-blankslate--default' },
	{ name: 'Card', category: 'Content', blurb: 'Content container with optional sections.', id: 'patterns-content-card--basic' },
	{ name: 'Carousel', category: 'Content', blurb: 'Swipeable set of slides with controls.', id: 'patterns-content-carousel--default' },
	{ name: 'ChatMessage', category: 'Content', blurb: 'Bubble layout for conversational UI.', id: 'patterns-content-chatmessage--default' },
	{ name: 'FlipContent', category: 'Content', blurb: 'Two-sided card that flips on interaction.', id: 'patterns-content-flipcontent--default' },
	{ name: 'FloatingContent', category: 'Content', blurb: 'Positioned overlay anchored to a trigger.', id: 'patterns-content-floatingcontent--default' },
	{ name: 'List Item Content', category: 'Content', blurb: 'Title, caption and trailing slot for lists.', id: 'patterns-content-list-item-content--default' },
	{ name: 'Section', category: 'Content', blurb: 'Page section with title and body slots.', id: 'patterns-content-section--default' },
	{ name: 'Table', category: 'Content', blurb: 'Styled data table for structured content.', id: 'patterns-content-table--default' },
	{ name: 'Tag', category: 'Content', blurb: 'Compact label for status or taxonomy.', id: 'patterns-content-tag--default' },
	{ name: 'UserAvatar', category: 'Content', blurb: 'Initials or image avatar for a person.', id: 'patterns-content-useravatar--default' },
	// Interaction
	{ name: 'ActionSheet', category: 'Interaction', blurb: 'Bottom sheet of contextual actions.', id: 'patterns-interaction-actionsheet--default' },
	{ name: 'AnimatedLabel', category: 'Interaction', blurb: 'Floating label that animates on focus.', id: 'patterns-interaction-animatedlabel--default' },
	{ name: 'BottomSheet', category: 'Interaction', blurb: 'Draggable panel that rises from the bottom.', id: 'patterns-interaction-bottomsheet--default' },
	{ name: 'ButtonLoading', category: 'Interaction', blurb: 'Button that swaps to a loading state.', id: 'patterns-interaction-buttonloading--default' },
	{ name: 'DatePicker', category: 'Interaction', blurb: 'Calendar input with ranges and locales.', id: 'patterns-interaction-datepicker--default' },
	{ name: 'Dropdown', category: 'Interaction', blurb: 'Filterable select with multi-selection.', id: 'patterns-interaction-dropdown--default' },
	{ name: 'FloatingActions', category: 'Interaction', blurb: 'Expandable FAB with secondary actions.', id: 'patterns-interaction-floatingactions--default' },
	{ name: 'InputWithIcon', category: 'Interaction', blurb: 'Text input with a leading or trailing icon.', id: 'patterns-interaction-inputwithicon--default' },
	{ name: 'LightboxImage', category: 'Interaction', blurb: 'Fullscreen image viewer with gestures.', id: 'patterns-interaction-lightboximage--default' },
	{ name: 'MonthPicker', category: 'Interaction', blurb: 'Month/year picker built on Flatpickr.', id: 'patterns-interaction-monthpicker--default' },
	{ name: 'Notification', category: 'Interaction', blurb: 'Toast-style feedback that auto-dismisses.', id: 'patterns-interaction-notification--default' },
	{ name: 'RangeSlider', category: 'Interaction', blurb: 'Single or dual-thumb numeric slider.', id: 'patterns-interaction-rangeslider--default' },
	{ name: 'ScrollableArea', category: 'Interaction', blurb: 'Scroll container with optional fade edges.', id: 'patterns-interaction-scrollablearea--default' },
	{ name: 'Search', category: 'Interaction', blurb: 'Search field with clear and optional icon.', id: 'patterns-interaction-search--default' },
	{ name: 'StackedCards', category: 'Interaction', blurb: 'Swipeable card stack for decision flows.', id: 'patterns-interaction-stackedcards--default' },
	{ name: 'TimePicker', category: 'Interaction', blurb: 'Time input with selectable intervals.', id: 'patterns-interaction-timepicker--default' },
	{ name: 'Tooltip', category: 'Interaction', blurb: 'Hover/focus tip anchored to a trigger.', id: 'patterns-interaction-tooltip--default' },
	// Navigation
	{ name: 'BottomBar', category: 'Navigation', blurb: 'Fixed tab bar for mobile navigation.', id: 'patterns-navigation-bottombar--default' },
	{ name: 'Breadcrumbs', category: 'Navigation', blurb: 'Hierarchical path back through screens.', id: 'patterns-navigation-breadcrumbs--default' },
	{ name: 'OverflowMenu', category: 'Navigation', blurb: 'Ellipsis menu for secondary actions.', id: 'patterns-navigation-overflowmenu--default' },
	{ name: 'Pagination', category: 'Navigation', blurb: 'Page controls for long result sets.', id: 'patterns-navigation-pagination--default' },
	{ name: 'SectionIndex', category: 'Navigation', blurb: 'Sticky index that jumps to page sections.', id: 'patterns-navigation-sectionindex--default' },
	{ name: 'Sidebar', category: 'Navigation', blurb: 'Off-canvas panel anchored to an edge.', id: 'patterns-navigation-sidebar--default' },
	{ name: 'Submenu', category: 'Navigation', blurb: 'Nested navigation under a parent item.', id: 'patterns-navigation-submenu--default' },
	{ name: 'Tabs', category: 'Navigation', blurb: 'Switch between sibling views in place.', id: 'patterns-navigation-tabs--default' },
	{ name: 'Timeline', category: 'Navigation', blurb: 'Vertical sequence of dated events.', id: 'patterns-navigation-timeline--default' },
	{ name: 'Wizard', category: 'Navigation', blurb: 'Step-by-step flow with progress markers.', id: 'patterns-navigation-wizard--wizard-story' },
	// Adaptive
	{ name: 'Columns', category: 'Adaptive', blurb: 'Responsive multi-column layout.', id: 'patterns-adaptive-columns--columns-2' },
	{ name: 'Gallery', category: 'Adaptive', blurb: 'Responsive grid that reflows per device.', id: 'patterns-adaptive-gallery--default' },
	{ name: 'MasterDetail', category: 'Adaptive', blurb: 'List + detail split that adapts by breakpoint.', id: 'patterns-adaptive-masterdetail--default' },
	// Numbers
	{ name: 'Badge', category: 'Numbers', blurb: 'Numeric or text badge for counts.', id: 'patterns-numbers-badge--default' },
	{ name: 'Counter', category: 'Numbers', blurb: 'Animated numeric counter display.', id: 'patterns-numbers-counter--default' },
	{ name: 'IconBadge', category: 'Numbers', blurb: 'Icon with an overlaid count badge.', id: 'patterns-numbers-iconbadge--default' },
	{ name: 'Progress', category: 'Numbers', blurb: 'Bar and circle variants for completion.', id: 'patterns-numbers-progress--bar' },
	{ name: 'Rating', category: 'Numbers', blurb: 'Star rating input and display.', id: 'patterns-numbers-rating--default' },
	// Utilities
	{ name: 'CenterContent', category: 'Utilities', blurb: 'Centers children in the available space.', id: 'patterns-utilities-centercontent--default' },
	{ name: 'InlineSvg', category: 'Utilities', blurb: 'Inline SVG helper for themed icons.', id: 'patterns-utilities-inlinesvg--default' },
	{ name: 'MarginContainer', category: 'Utilities', blurb: 'Spacing wrapper using theme margins.', id: 'patterns-utilities-margincontainer--default' },
	{ name: 'Separator', category: 'Utilities', blurb: 'Horizontal or vertical content divider.', id: 'patterns-utilities-separator--default' },
	{ name: 'SwipeEvents', category: 'Utilities', blurb: 'Gesture helpers for swipe interactions.', id: 'patterns-utilities-swipeevents--default' },
	{ name: 'TouchEvents', category: 'Utilities', blurb: 'Low-level touch event helpers.', id: 'patterns-utilities-touchevents--default' },
	{ name: 'Video', category: 'Utilities', blurb: 'Themed video player chrome.', id: 'patterns-utilities-video--default' },
	// Advanced
	{ name: 'DropdownServerSide', category: 'Advanced', blurb: 'Dropdown fed by a server-side data source.', id: 'patterns-advanced-dropdownserverside--default' },
];

const CATEGORIES: Array<PatternCategory | 'All'> = [
	'All',
	'Content',
	'Interaction',
	'Navigation',
	'Adaptive',
	'Numbers',
	'Utilities',
	'Advanced',
];

function countByCategory(cat: PatternCategory | 'All'): number {
	if (cat === 'All') return PATTERN_CATALOGUE.length;
	return PATTERN_CATALOGUE.filter((p) => p.category === cat).length;
}

function catSlug(cat: PatternCategory | 'All'): string {
	return cat.toLowerCase();
}

function storyHref(id: string): string {
	return `?path=/story/${id}`;
}

/**
 * Interactive pattern browser for the Welcome page — search + category chips
 * filter the live Storybook catalogue and link into each pattern's story.
 */
export function PatternCatalogue({ layout = 'compact' }: { layout?: 'compact' | 'full' } = {}) {
	const [query, setQuery] = React.useState('');
	const [category, setCategory] = React.useState<PatternCategory | 'All'>('All');

	const filtered = React.useMemo(() => {
		const q = query.trim().toLowerCase();
		return PATTERN_CATALOGUE.filter((p) => {
			if (category !== 'All' && p.category !== category) return false;
			if (!q) return true;
			return (
				p.name.toLowerCase().includes(q) ||
				p.blurb.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
			);
		});
	}, [query, category]);

	const total = PATTERN_CATALOGUE.length;

	return (
		<div className={`sec osui-pattern-browser osui-pattern-browser--${layout}`} id="patterns">
			<div className="sec-head">
				<div className="sec-kicker">Catalogue</div>
				<h2>Every pattern, live and documented</h2>
				<p>
					Each entry has a live example and the properties you set in ODC Studio — running the same
					library your app loads.
				</p>
			</div>
			<div className="browser">
				<div className="browser-top">
					<label className="search">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							<circle cx="11" cy="11" r="7" />
							<path d="m20 20-3.5-3.5" />
						</svg>
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={`Search ${total} patterns…`}
							aria-label="Search patterns"
						/>
					</label>
				</div>
				<div className="cats" role="tablist" aria-label="Pattern categories">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							type="button"
							role="tab"
							data-cat={catSlug(cat)}
							aria-selected={category === cat}
							aria-pressed={category === cat}
							onClick={() => setCategory(cat)}
						>
							{cat} <i>{countByCategory(cat)}</i>
						</button>
					))}
				</div>
				{filtered.length > 0 ? (
					<div className="pat-grid">
						{filtered.map((p) => (
							<a key={p.id} className="pat" data-cat={catSlug(p.category)} href={storyHref(p.id)}>
								<b>{p.name}</b>
								<span>{p.blurb}</span>
								<span className="meta">{p.category}</span>
							</a>
						))}
					</div>
				) : (
					<div className="browser-empty">No patterns match “{query}”.</div>
				)}
				<div className="browser-foot">
					Showing {filtered.length} of {total}
					{(category !== 'All' || query) && (
						<button type="button" className="browser-foot__reset" onClick={() => { setQuery(''); setCategory('All'); }}>
							Clear filters
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
