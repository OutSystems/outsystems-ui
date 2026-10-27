import type { PatternDocMeta } from './types';

export const NOTIFICATION_DOC: PatternDocMeta = {
	name: 'Notification',
	category: 'Interaction',
	lede: 'Toast-style feedback that auto-dismisses.',
	overview:
		'Use Notification when you need toast-style feedback that auto-dismisses in your application UI.',
	stylingSelector: '.notification',
	liveStoryId: 'patterns-interaction-notification--default',

	whenToUse: [
		'When toast-style feedback that auto-dismisses.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="notification">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Notification',
			rows: [
				{ name: 'Position', type: 'Text', description: 'Maps to the Position input parameter.' },
				{ name: 'Width', type: 'Text', description: 'Maps to the Width input parameter.' },
				{ name: 'InteractToClose', type: 'Text', description: 'Maps to the InteractToClose input parameter.' },
				{ name: 'CloseAfterTime (ms, 0 = off)', type: 'Text', description: 'Maps to the CloseAfterTime (ms, 0 = off) input parameter.' },
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
		{ name: 'ActionSheet', storyId: 'patterns-interaction-actionsheet--default' },
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
