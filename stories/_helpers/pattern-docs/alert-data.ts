import type { PatternDocMeta } from './types';

export const ALERT_DOC: PatternDocMeta = {
	name: 'Alert',
	category: 'Content',
	lede:
		'Inline status message with a severity tone — surfaces success, info, warning, or error feedback without leaving the current screen.',
	overview:
		'Use the Alert pattern to communicate contextual feedback inline. The severity type sets colour, icon, and border treatment; optional vivid styling switches to a solid-fill look.',
	stylingSelector: '.alert',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/alert/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/alert/',
	liveStoryId: 'patterns-content-alert--basic-usage',
	cssApiSlug: 'patterns-content-alert',
	whenToUse: [
		'Confirming an action completed successfully (save, submit, sync).',
		'Warning users before a risky or irreversible step.',
		'Surfacing validation or system errors on the same screen.',
		'Neutral contextual information that should stay visible until dismissed or replaced.',
	],
	whenNotToUse: [
		'Transient feedback that auto-dismisses — use Notification instead.',
		'Blocking decisions that need explicit confirmation — use a dialog.',
		'Long-form content or multi-step guidance — use Card or Section.',
	],
	anatomy: {
		tree: `<div class="alert alert-success" role="alert" aria-live="polite" aria-atomic="true">
  <div class="alert-icon" aria-hidden="true"></div>
  <div class="alert-message">
    <span>Success! Your changes were saved.</span>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Alert',
			rows: [
				{
					name: 'AlertType',
					type: 'AlertType',
					defaultValue: 'Success',
					description:
						'Sets the severity tone — Success, Info, Warning, or Error. Maps to `.alert-success`, `.alert-info`, `.alert-warning`, or `.alert-error` on the root.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Alert root. Add `vivid` for the solid-fill look. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'The root uses role="alert" so assistive tech announces the message when it appears.',
		'aria-live="polite" and aria-atomic="true" keep screen-reader updates predictable without interrupting the user.',
		'The status icon is decorative — aria-hidden="true" on `.alert-icon`; the message text carries the meaning.',
		'Use the Storybook A11y features toolbar to preview focus rings on the live demo.',
	],
	related: [
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Notification', storyId: 'patterns-interaction-notification--default' },
	],
};
