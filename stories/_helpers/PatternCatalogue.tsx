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
	/** Storybook story id, e.g. patterns-content-accordion--playground */
	id: string;
};

/** Catalogue of every storied OUI pattern — blurbs are one-liners for the Welcome browser. */
export const PATTERN_CATALOGUE: PatternEntry[] = [
	// Content
	{ name: 'Accordion', category: 'Content', blurb: 'Stacked sections that expand on click.', id: 'patterns-content-accordion--docs' },
	{ name: 'Alert', category: 'Content', blurb: 'Inline status message with a severity tone.', id: 'patterns-content-alert--docs' },
	{ name: 'Blank Slate', category: 'Content', blurb: 'Empty-state placeholder with optional action.', id: 'patterns-content-blank-slate--docs' },
	{ name: 'Card', category: 'Content', blurb: 'Content container with optional sections.', id: 'patterns-content-card--docs' },
	{ name: 'Card Background', category: 'Content', blurb: 'Hero tile with an image layer and colour overlay.', id: 'patterns-content-card-background--docs' },
	{ name: 'Card Item', category: 'Content', blurb: 'List row with left, center and right slots.', id: 'patterns-content-card-item--docs' },
	{ name: 'Card Sectioned', category: 'Content', blurb: 'Card with image, title, content and footer slots.', id: 'patterns-content-card-sectioned--docs' },
	{ name: 'Carousel', category: 'Content', blurb: 'Swipeable set of slides with controls.', id: 'patterns-content-carousel--docs' },
	{ name: 'Chat Message', category: 'Content', blurb: 'Bubble layout for conversational UI.', id: 'patterns-content-chat-message--docs' },
	{ name: 'Flip Content', category: 'Content', blurb: 'Two-sided card that flips on interaction.', id: 'patterns-content-flip-content--docs' },
	{ name: 'Floating Content', category: 'Content', blurb: 'Positioned overlay anchored to a trigger.', id: 'patterns-content-floating-content--docs' },
	{ name: 'List Item Content', category: 'Content', blurb: 'Title, caption and trailing slot for lists.', id: 'patterns-content-list-item-content--docs' },
	{ name: 'Section', category: 'Content', blurb: 'Page section with title and body slots.', id: 'patterns-content-section--docs' },
	{ name: 'Table', category: 'Content', blurb: 'Styled data table for structured content.', id: 'patterns-content-table--docs' },
	{ name: 'Tag', category: 'Content', blurb: 'Compact label for status or taxonomy.', id: 'patterns-content-tag--docs' },
	{ name: 'User Avatar', category: 'Content', blurb: 'Initials or image avatar for a person.', id: 'patterns-content-user-avatar--docs' },
	// Interaction
	{ name: 'Action Sheet', category: 'Interaction', blurb: 'Bottom sheet of contextual actions.', id: 'patterns-interaction-action-sheet--docs' },
	{ name: 'Animated Label', category: 'Interaction', blurb: 'Floating label that animates on focus.', id: 'patterns-interaction-animated-label--docs' },
	{ name: 'Bottom Sheet', category: 'Interaction', blurb: 'Draggable panel that rises from the bottom.', id: 'patterns-interaction-bottom-sheet--docs' },
	{ name: 'Button Loading', category: 'Utilities', blurb: 'Button that swaps to a loading state.', id: 'patterns-utilities-button-loading--docs' },
	{ name: 'Date Picker', category: 'Interaction', blurb: 'Calendar input with ranges and locales.', id: 'patterns-interaction-date-picker--docs' },
	{ name: 'Dropdown', category: 'Interaction', blurb: 'Filterable select with multi-selection.', id: 'patterns-interaction-dropdown--docs' },
	{ name: 'Dropdown Tags', category: 'Interaction', blurb: 'Multi-select dropdown that shows selections as tags.', id: 'patterns-interaction-dropdown-tags--docs' },
	{ name: 'Floating Actions', category: 'Interaction', blurb: 'Expandable FAB with secondary actions.', id: 'patterns-interaction-floating-actions--docs' },
	{ name: 'Input With Icon', category: 'Interaction', blurb: 'Text input with a leading or trailing icon.', id: 'patterns-interaction-input-with-icon--docs' },
	{ name: 'Lightbox Image', category: 'Interaction', blurb: 'Fullscreen image viewer with gestures.', id: 'patterns-interaction-lightbox-image--docs' },
	{ name: 'Month Picker', category: 'Interaction', blurb: 'Month/year picker built on Flatpickr.', id: 'patterns-interaction-month-picker--docs' },
	{ name: 'Notification', category: 'Interaction', blurb: 'Toast-style feedback that auto-dismisses.', id: 'patterns-interaction-notification--docs' },
	{ name: 'Range Slider', category: 'Interaction', blurb: 'Single or dual-thumb numeric slider.', id: 'patterns-interaction-range-slider--docs' },
	{ name: 'Scrollable Area', category: 'Interaction', blurb: 'Scroll container with optional fade edges.', id: 'patterns-interaction-scrollable-area--docs' },
	{ name: 'Search', category: 'Interaction', blurb: 'Search field with clear and optional icon.', id: 'patterns-interaction-search--docs' },
	{ name: 'Stacked Cards', category: 'Interaction', blurb: 'Swipeable card stack for decision flows.', id: 'patterns-interaction-stacked-cards--docs' },
	{ name: 'Time Picker', category: 'Interaction', blurb: 'Time input with selectable intervals.', id: 'patterns-interaction-time-picker--docs' },
	{ name: 'Tooltip', category: 'Interaction', blurb: 'Hover/focus tip anchored to a trigger.', id: 'patterns-interaction-tooltip--docs' },
	// Navigation
	{ name: 'Bottom Bar', category: 'Navigation', blurb: 'Fixed tab bar for mobile navigation.', id: 'patterns-navigation-bottom-bar--docs' },
	{ name: 'Breadcrumbs', category: 'Navigation', blurb: 'Hierarchical path back through screens.', id: 'patterns-navigation-breadcrumbs--docs' },
	{ name: 'Overflow Menu', category: 'Navigation', blurb: 'Ellipsis menu for secondary actions.', id: 'patterns-navigation-overflow-menu--docs' },
	{ name: 'Pagination', category: 'Navigation', blurb: 'Page controls for long result sets.', id: 'patterns-navigation-pagination--docs' },
	{ name: 'Section Index', category: 'Navigation', blurb: 'Sticky index that jumps to page sections.', id: 'patterns-navigation-section-index--docs' },
	{ name: 'Sidebar', category: 'Navigation', blurb: 'Off-canvas panel anchored to an edge.', id: 'patterns-navigation-sidebar--docs' },
	{ name: 'Submenu', category: 'Navigation', blurb: 'Nested navigation under a parent item.', id: 'patterns-navigation-submenu--docs' },
	{ name: 'Tabs', category: 'Navigation', blurb: 'Switch between sibling views in place.', id: 'patterns-navigation-tabs--docs' },
	{ name: 'Timeline', category: 'Navigation', blurb: 'Vertical sequence of dated events.', id: 'patterns-navigation-timeline--docs' },
	{ name: 'Wizard', category: 'Navigation', blurb: 'Step-by-step flow with progress markers.', id: 'patterns-navigation-wizard--docs' },
	// Adaptive
	{ name: 'Columns', category: 'Adaptive', blurb: 'Responsive multi-column layout.', id: 'patterns-adaptive-columns--docs' },
	{ name: 'Gallery', category: 'Adaptive', blurb: 'Responsive grid that reflows per device.', id: 'patterns-adaptive-gallery--docs' },
	{ name: 'Master Detail', category: 'Adaptive', blurb: 'List + detail split that adapts by breakpoint.', id: 'patterns-adaptive-master-detail--docs' },
	// Numbers
	{ name: 'Badge', category: 'Numbers', blurb: 'Numeric or text badge for counts.', id: 'patterns-numbers-badge--docs' },
	{ name: 'Counter', category: 'Numbers', blurb: 'Animated numeric counter display.', id: 'patterns-numbers-counter--docs' },
	{ name: 'Icon Badge', category: 'Numbers', blurb: 'Icon with an overlaid count badge.', id: 'patterns-numbers-icon-badge--docs' },
	{ name: 'Progress Bar', category: 'Numbers', blurb: 'Linear completion indicator.', id: 'patterns-numbers-progress-bar--docs' },
	{ name: 'Progress Circle', category: 'Numbers', blurb: 'Circular completion indicator.', id: 'patterns-numbers-progress-circle--docs' },
	{ name: 'Rating', category: 'Numbers', blurb: 'Star rating input and display.', id: 'patterns-numbers-rating--docs' },
	// Utilities
	{ name: 'Center Content', category: 'Utilities', blurb: 'Centers children in the available space.', id: 'patterns-utilities-center-content--docs' },
	{ name: 'Inline SVG', category: 'Utilities', blurb: 'Inline SVG helper for themed icons.', id: 'patterns-utilities-inline-svg--docs' },
	{ name: 'Margin Container', category: 'Utilities', blurb: 'Spacing wrapper using theme margins.', id: 'patterns-utilities-margin-container--docs' },
	{ name: 'Separator', category: 'Utilities', blurb: 'Horizontal or vertical content divider.', id: 'patterns-utilities-separator--docs' },
	{ name: 'Swipe Events', category: 'Utilities', blurb: 'Gesture helpers for swipe interactions.', id: 'patterns-utilities-swipe-events--docs' },
	{ name: 'Touch Events', category: 'Utilities', blurb: 'Low-level touch event helpers.', id: 'patterns-utilities-touch-events--docs' },
	{ name: 'Password Policy', category: 'Utilities', blurb: 'Live checklist of password rules as the user types.', id: 'patterns-utilities-password-policy--docs' },
	{ name: 'Provider Login Button', category: 'Utilities', blurb: 'Branded sign-in button for an identity provider.', id: 'patterns-utilities-provider-login-button--docs' },
	{ name: 'Video', category: 'Utilities', blurb: 'Themed video player chrome.', id: 'patterns-utilities-video--docs' },
	// Advanced
	{ name: 'Dropdown Server Side', category: 'Advanced', blurb: 'Dropdown fed by a server-side data source.', id: 'patterns-advanced-dropdown-server-side--docs' },
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
	if (id.endsWith('--docs')) return `?path=/docs/${id}`;
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
