// @ts-check
/**
 * Hand-curated pointers into the public OutSystems Developer Cloud documentation (success.outsystems.com),
 * rendered into docs-ai/llms.txt and into the component cards. Everything else in docs-ai/ is derived from
 * the source; this module is the one place where platform concepts an agent cannot read from this repository
 * (screens, layouts, themes, blocks, accessibility, the pattern catalogue) are summarised, with the page to
 * read for the details. Every URL below was checked to resolve (HTTP 200) when it was added.
 */

export const DOCS_BASE = 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface';

/** @param {string} path */
const page = (path) => `${DOCS_BASE}/${path}/`;

/**
 * The platform pattern catalogue as the documentation groups it: category → documented pattern → page slug.
 * Keys are the names the documentation uses; `runtime` names the TypeScript pattern(s) or CSS component(s) of
 * this repository that implement it (null when the pattern lives in another library or in platform widgets).
 * @type {Record<string, Record<string, { slug: string, runtime: string[] }>>}
 */
export const PATTERN_PAGES = {
	Adaptive: {
		Columns: { slug: 'adaptive/columns', runtime: ['columns'] },
		'Display on Device': { slug: 'adaptive/display_on_device', runtime: [] },
		Gallery: { slug: 'adaptive/gallery', runtime: ['Gallery'] },
		'Master Detail': { slug: 'adaptive/master_detail', runtime: ['master-detail'] },
	},
	Content: {
		Accordion: { slug: 'content/accordion', runtime: ['Accordion', 'AccordionItem'] },
		Alert: { slug: 'content/alert', runtime: ['alert'] },
		'Blank Slate': { slug: 'content/blank_slate', runtime: ['blank-slate'] },
		Card: { slug: 'content/card', runtime: ['card'] },
		'Card Background': { slug: 'content/card_background', runtime: ['card-background'] },
		'Card Item': { slug: 'content/card_item', runtime: ['card-item'] },
		'Card Sectioned': { slug: 'content/card_sectioned', runtime: ['card-sectioned'] },
		'Chat Message': { slug: 'content/chat_message', runtime: ['chat-message'] },
		'Flip Content': { slug: 'content/flip_content', runtime: ['FlipContent'] },
		'Floating Content': { slug: 'content/floating_content', runtime: ['floating-content'] },
		'List Item Content': { slug: 'content/list_item_content', runtime: ['list-item-content'] },
		Section: { slug: 'content/section', runtime: ['section'] },
		'Section Group': { slug: 'content/section_group', runtime: ['section'] },
		Tag: { slug: 'content/tag', runtime: ['tag'] },
		Tooltip: { slug: 'content/tooltip', runtime: ['Tooltip'] },
		'User Avatar': { slug: 'content/user_avatar', runtime: ['user-avatar'] },
	},
	Interaction: {
		'Action Sheet': { slug: 'interaction/action_sheet', runtime: ['action-sheet'] },
		Animate: { slug: 'interaction/animate', runtime: ['animate'] },
		'Animated Label': { slug: 'interaction/animated_label', runtime: ['AnimatedLabel'] },
		'Bottom Sheet': { slug: 'interaction/bottom_sheet', runtime: ['BottomSheet'] },
		Carousel: { slug: 'interaction/carousel', runtime: ['Carousel'] },
		'Date Picker': { slug: 'interaction/date_picker', runtime: ['DatePicker'] },
		'Date Picker Range': { slug: 'interaction/date_picker_range', runtime: ['DatePicker'] },
		'Dropdown Search': { slug: 'interaction/dropdown_search', runtime: ['Dropdown'] },
		'Dropdown Tags': { slug: 'interaction/dropdown_tags', runtime: ['Dropdown'] },
		'Floating Actions': { slug: 'interaction/floating_actions', runtime: ['floating-actions'] },
		'Input with Icon': { slug: 'interaction/input_with_icon', runtime: ['input-with-icon'] },
		'Lightbox Image': { slug: 'interaction/lightbox_image', runtime: ['lightbox-image'] },
		'Month Picker': { slug: 'interaction/month_picker', runtime: ['MonthPicker'] },
		Notification: { slug: 'interaction/notification', runtime: ['Notification'] },
		'Range Slider': { slug: 'interaction/range_slider', runtime: ['RangeSlider'] },
		'Range Slider Interval': { slug: 'interaction/range_slider_interval', runtime: ['RangeSlider'] },
		'Scrollable Area': { slug: 'interaction/scrollable_area', runtime: ['scrollable-area'] },
		Search: { slug: 'interaction/search', runtime: ['Search'] },
		Sidebar: { slug: 'interaction/sidebar', runtime: ['Sidebar'] },
		'Stacked Cards': { slug: 'interaction/stacked_cards', runtime: ['stacked-cards'] },
		'Time Picker': { slug: 'interaction/time_picker', runtime: ['TimePicker'] },
		Video: { slug: 'interaction/video', runtime: ['Video'] },
	},
	Navigation: {
		'Bottom Bar Item': { slug: 'navigation/bottom_bar_item', runtime: ['bottom-bar-item'] },
		Breadcrumbs: { slug: 'navigation/breadcrumbs', runtime: ['breadcrumbs'] },
		Pagination: { slug: 'navigation/pagination', runtime: ['pagination'] },
		'Section Index': { slug: 'navigation/section_index', runtime: ['SectionIndex', 'SectionIndexItem'] },
		Submenu: { slug: 'navigation/submenu', runtime: ['Submenu'] },
		Tabs: { slug: 'navigation/tabs', runtime: ['Tabs', 'TabsHeaderItem', 'TabsContentItem'] },
		'Timeline Item': { slug: 'navigation/timeline_item', runtime: ['timeline'] },
		Wizard: { slug: 'navigation/wizard', runtime: ['Wizard', 'WizardItem'] },
	},
	Numbers: {
		Badge: { slug: 'numbers/badge', runtime: ['badge'] },
		Counter: { slug: 'numbers/counter', runtime: ['counter'] },
		'Icon Badge': { slug: 'numbers/icon_badge', runtime: ['icon-badge'] },
		'Progress Bar': { slug: 'numbers/progress_bar', runtime: ['Progress'] },
		'Progress Circle': { slug: 'numbers/progress_circle', runtime: ['Progress'] },
		Rating: { slug: 'numbers/rating', runtime: ['Rating'] },
	},
	Utilities: {
		'Align Center': { slug: 'utilities/align_center', runtime: ['align-center'] },
		'Button Loading': { slug: 'utilities/button_loading', runtime: ['ButtonLoading'] },
		'Center Content': { slug: 'utilities/center_content', runtime: ['center-content'] },
		'Inline SVG': { slug: 'utilities/inline_svg', runtime: ['InlineSvg'] },
		'Margin Container': { slug: 'utilities/margin_container', runtime: ['margin-container'] },
		'Mouse Events': { slug: 'utilities/mouse_events', runtime: [] },
		Separator: { slug: 'utilities/separator', runtime: ['separator'] },
		'Swipe Events': { slug: 'utilities/swipe_events', runtime: ['SwipeEvents'] },
		'Touch Events': { slug: 'utilities/touch_events', runtime: ['TouchEvents'] },
	},
};

/** @param {string} slug a pattern page slug such as `content/accordion` */
export const patternPage = (slug) => page(`patterns/${slug}`);

/**
 * Documentation page slugs of every runtime pattern / CSS component that has one, by the repository's name.
 * Cards cite the slug (`content/accordion`); `patternPage(slug)` is the URL and the manifest carries it.
 * @returns {Map<string, string[]>}
 */
export function docsByRuntimeName() {
	/** @type {Map<string, string[]>} */
	const out = new Map();
	for (const group of Object.values(PATTERN_PAGES)) {
		for (const { slug, runtime } of Object.values(group)) {
			for (const name of runtime) {
				const list = out.get(name) ?? [];
				list.push(slug);
				out.set(name, list);
			}
		}
	}
	return out;
}


/** The concept pages an agent reads before composing screens, with a one-line summary of each. */
export const CONCEPT_PAGES = [
	{
		title: 'User interface (overview)',
		url: `${DOCS_BASE}/`,
		summary:
			'OutSystems UI is the responsive, WCAG-compliant framework behind every ODC app: screen templates, UI patterns dragged from the ODC Studio toolbox, and a theme whose CSS rules colours, headings, margins and paddings. Right-to-left layouts are supported.',
	},
	{
		title: 'Screens',
		url: page('screens'),
		summary:
			'A screen is composed of blocks and placeholders. A new empty screen uses the LayoutTopMenu block from the Layouts flow, with the placeholders Header (sign-in logic), Breadcrumbs, Title, Actions, MainContent and Footer; template screens may use other layout blocks. Placeholders render only when they hold content.',
	},
	{
		title: 'Reuse UI (blocks)',
		url: page('reuse_ui'),
		summary:
			'Blocks are reusable interface + logic units placed on screens or inside other blocks. A block talks to its parent through events (with payload); a parent drives a child through its input parameters; siblings combine both through the parent.',
	},
	{
		title: 'Themes',
		url: page('themes'),
		summary:
			'A theme owns the style sheet, icon library and grid settings (columns, gutter, min/max width, layout). Every app has a default theme that inherits from a base theme, most often the OutSystems UI base theme; branding is custom CSS on top (colours, fonts, spacing, CSS variables per light/dark context). The Theme Editor generates that CSS from primary/secondary colour, font and font size. A theme library shares themes, layouts and images across apps.',
	},
	{
		title: 'Screen templates',
		url: page('screen_templates'),
		summary:
			'Predefined layouts, widgets, patterns, styles and logic with sample data; drop an entity on a widget to replace the sample data and ODC Studio adapts the UI.',
	},
	{
		title: 'Accessibility',
		url: page('accessibility'),
		summary:
			'Set the layout\'s EnableAccessibilityFeatures to True for focus states, skip-to-content and enhanced contrast. Give every screen a title, every image an alt (empty for decorative), bind each Label to its input, build heading structure with HTML Element widgets (h1…), and use ARIA for dynamic content; SetAccessibilityRole, SetAriaHidden, SetFocus and ToggleTextSpacing are the client actions. The skip target defaults to MainContentWrapper. The patterns accessibility reference lists the roles each pattern applies.',
	},
	{
		title: 'UI patterns accessibility reference',
		url: page('accessibility/ui_patterns_accessibility_reference'),
		summary:
			'Per-pattern ARIA notes, e.g. Alert uses role alert for Error/Warning and status for Success/Info; Master Detail needs tabindex and MasterDetailSetContentFocus.',
	},
	{
		title: 'Icon widget reference',
		url: page('screens/icon_widget_reference'),
		summary: 'The Icon widget and its libraries (Phosphor, Font Awesome); the generated classes are listed in osui.icons.json.',
	},
];

/**
 * The llms.txt section: concept pages, then the pattern catalogue by category with the runtime name(s) each
 * documented pattern maps to, so an agent can go from the platform's vocabulary to a card in this repository.
 * @param {Set<string>} knownRuntime names present in the manifests (unknown ones are shown without a link)
 */
export function renderPlatformSection(knownRuntime) {
	const lines = ['# OutSystems UI — platform context (ODC documentation)', ''];
	lines.push(
		'Human documentation for the concepts this library does not define. Load a page only when a card is not enough; each is 1–3k tokens. Pattern pages: ' +
			`${DOCS_BASE}/patterns/<category>/<slug>/ — the \`Docs:\` line of a card gives the slug.`
	);
	lines.push('', '## Concept pages');
	for (const c of CONCEPT_PAGES) lines.push(`- ${c.title} — ${c.url}\n  ${c.summary}`);
	lines.push('');
	lines.push('## Pattern catalogue (documentation name → runtime card)');
	lines.push(
		'The ODC toolbox groups patterns in six categories; a documented pattern maps to a TypeScript pattern (a card in llms-components.txt) or a CSS-only component (llms-patterns.txt). Format: Name (slug) → runtime card(s).'
	);
	for (const [category, patterns] of Object.entries(PATTERN_PAGES)) {
		const items = Object.entries(patterns).map(([title, { slug, runtime }]) => {
			const targets = runtime.length
				? runtime.map((r) => (knownRuntime.has(r) ? r : `${r}?`)).join(' + ')
				: 'platform widget / other library';
			return `${title} (${slug.split('/')[1]}) → ${targets}`;
		});
		lines.push(`- ${category}: ${items.join(' · ')}`);
	}
	return lines.join('\n');
}
