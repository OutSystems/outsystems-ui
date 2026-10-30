import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const SECTION_INDEX_DOC: PatternDocMeta = {
	name: 'Section Index',
	category: 'Navigation',
	lede: 'In-page table of contents — a vertical list of links that scrolls to the sections of a long screen and highlights the one in view.',
	overview:
		'Section Index holds one Section Index Item per section in its Content placeholder; each item points at a widget on the screen through ScrollToWidgetId. Clicking an item scrolls that widget into view (animated when SmoothScrolling is True, offset so a fixed header never covers it) and marks the item active; as the user scrolls, the runtime moves the active marker to whichever section is at the top. IsFixed makes the index sticky so it stays visible while the content scrolls past.',
	stylingSelector: '.osui-section-index',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/section_index/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/section_index/',
	liveStoryId: 'patterns-navigation-sectionindex--basic-usage',
	cssApiSlug: 'patterns-navigation-sectionindex',
	whenToUse: [
		'Long single-page screens with named sections — settings, profiles, product detail, documentation.',
		'Forms split into logical blocks where users jump between parts instead of filling them in order.',
		'Desktop and tablet layouts with a free side column; on phones the fixed index docks to the edge.',
	],
	whenNotToUse: [
		'Content that should be shown one part at a time — use Tabs or a Wizard instead.',
		'Short screens that fit in a viewport or two; a Breadcrumbs trail or plain headings are enough.',
	],
	anatomy: {
		tree: `<nav class="osui-section-index"> <!-- IsFixed adds .osui-section-index--is-sticky -->
  <!-- Content placeholder: one Section Index Item per section -->
  <div class="osui-section-index-item osui-section-index-item--is-active" role="button" tabindex="0" data-item="<targetId>">
    <!-- Content placeholder: label text -->
  </div>
  <div class="osui-section-index-item" role="button" tabindex="0" data-item="<targetId>">…</div>
</nav>

<!-- elsewhere on the screen, the widgets named by ScrollToWidgetId -->
<div id="<targetId>" class="osui-section-index-item__target"> <!-- runtime adds the class and a scroll-margin -->
  …
</div>`,
	},
	properties: [
		{
			title: 'Section Index',
			rows: [
				{
					name: 'SmoothScrolling',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'If True, navigation to the destination is animated.',
				},
				{
					name: 'IsFixed',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'If True, the Section Index Pattern is always in the same position on the screen — it becomes sticky below the header (fixed to the side edge on phones).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Section Index root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Section Index Item',
			rows: [
				{
					name: 'ScrollToWidgetId',
					type: 'Text',
					description:
						'Element to where the page will navigate — the Id of the widget (Container, Section, …) this item scrolls to. Mandatory.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Section Index Item root.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Section Index — fires once the instance is ready (SectionIndexId).' },
		{
			name: 'Initialized (Section Index Item)',
			description: 'Fires once the item instance is ready and attached to its parent index (SectionIndexItemId).',
		},
	],
	apiSections: [
		{
			title: 'Section Index API',
			rows: [
				{ name: 'Create', description: 'Register a new Section Index instance with its configs.' },
				{ name: 'Initialize', description: 'Build the index, apply IsFixed and start listening for scroll.' },
				{ name: 'ChangeProperty', description: 'Update SmoothScrolling or IsFixed at runtime.' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'GetSectionIndexById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllSectionIndexItemsMap', description: 'List the ids of every registered Section Index.' },
				{ name: 'Dispose', description: 'Tear down the index and its scroll handlers (after its items).' },
			],
		},
		{
			title: 'Section Index Item API',
			rows: [
				{ name: 'Create', description: 'Register an item; it joins the closest .osui-section-index parent.' },
				{
					name: 'Initialize',
					description: 'Resolve the target widget, set role/tabindex and wire click and keyboard.',
				},
				{ name: 'ChangeProperty', description: 'Point the item at another widget (ScrollToWidgetId).' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'GetSectionIndexItemById', description: 'Return the item instance registered under an id.' },
				{ name: 'GetAllSectionIndexItemItemsMap', description: 'List the ids of every registered item.' },
				{ name: 'Dispose', description: 'Tear down the item and detach it from its parent.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Each item gets role="button" and tabindex="0" from the runtime, so it is reachable with ',
			React.createElement(PdKey, null, 'Tab'),
			' and ',
			React.createElement(PdKey, { wide: true, children: 'Enter' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' navigate exactly like a click.'
		),
		'The active item is conveyed by colour, a faux-bold text shadow and the indicator bar; under .os-high-contrast the rail and indicator are redrawn as borders in --color-focus-outer.',
		'The runtime writes a scroll-margin on every target so a fixed header never hides the section heading after a jump.',
		'SmoothScrolling animates the jump and does not check prefers-reduced-motion — bind it to a user preference (or set it to False) for motion-sensitive audiences.',
	],
	related: [
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--docs' },
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
