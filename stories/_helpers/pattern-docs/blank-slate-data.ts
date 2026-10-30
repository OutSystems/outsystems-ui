import type { PatternDocMeta } from './types';

export const BLANK_SLATE_DOC: PatternDocMeta = {
	name: 'Blank Slate',
	category: 'Content',
	lede: 'Empty-state placeholder with icon, description, and optional action — guides users when there is no data or a first step is needed.',
	overview:
		'Use Blank Slate when a list, table, or page has nothing to show yet. Combine a descriptive message with an optional call to action so users know what to do next.',
	stylingSelector: '.blank-slate',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/blank_slate/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/blank_slate/',
	liveStoryId: 'patterns-content-blankslate--basic-usage',
	cssApiSlug: 'patterns-content-blank-slate',
	whenToUse: [
		'A list or table is empty on first use or after filters return no results.',
		'Users need a clear next step — create an item, import data, or change filters.',
		'An entire content area has no data yet and should feel intentional, not broken.',
	],
	whenNotToUse: [
		'Inline status feedback — use Alert instead.',
		'Loading or fetching data — use a spinner or skeleton state.',
		'Errors that block the whole screen — use an error page or dialog.',
	],
	anatomy: {
		tree: `<div class="blank-slate large">
  <div>
    <div class="blank-slate-icon">
      <!-- Image or Icon widget — illustration -->
    </div>
    <div class="blank-slate-description">
      <div>No projects yet</div>
      <p>Create a project to organize tasks, files, and conversations.</p>
    </div>
    <div class="blank-slate-actions">
      <!-- Button widgets -->
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Blank Slate',
			rows: [
				{
					name: 'FullHeight',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'When True, the pattern grows to fill the available height and uses a larger icon (`.large` on the root). When False, it stays compact for inline empty states.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Blank Slate root. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Keep the description concise — it carries the meaning of the empty state for all users.',
		'Mark decorative icons with aria-hidden="true" when the description already explains the state.',
		'Actions in the Actions placeholder should use visible button labels (not icon-only).',
		'Use the Storybook A11y features toolbar to preview focus order on action buttons.',
	],
	related: [
		{ name: 'Alert', storyId: 'patterns-content-alert--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
