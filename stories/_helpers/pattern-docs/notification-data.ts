import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const NOTIFICATION_DOC: PatternDocMeta = {
	name: 'Notification',
	category: 'Interaction',
	lede: 'Native-looking message that slides in from an edge of the screen to confirm what just happened, then gets out of the way.',
	overview:
		'The notification is a fixed panel the runtime shows and hides on demand (StartsOpen, the NotificationOpen / NotificationClose client actions, or the Show / Hide API). Position picks the edge it slides in from, Width its size, and the OptionalConfigs decide whether a click on it dismisses it (InteractToClose) and whether it closes by itself after CloseAfterTime milliseconds. While open it behaves as an alert dialog: focus moves in and is trapped, and returns to the trigger on close.',
	stylingSelector: '.osui-notification',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/notification/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/notification/',
	liveStoryId: 'patterns-interaction-notification--basic-usage',
	cssApiSlug: 'patterns-interaction-notification',
	whenToUse: [
		'Confirming a completed action — invoice sent, draft saved, item added to the cart.',
		'Transient status that should not interrupt the flow but must be noticed (sync finished, new message).',
		'Mobile apps that want a system-style banner from the top or bottom edge.',
	],
	whenNotToUse: [
		'Inline, persistent feedback tied to a form or section — use Alert, which stays in the content flow.',
		'Messages that need a decision or several actions — use a Popup or Bottom Sheet.',
	],
	anatomy: {
		tree: `<div class="osui-notification osui-notification--is-top" name="<id>" role="alertdialog" aria-hidden="true" tabindex="-1">
  <!-- + osui-notification--is-open while shown; --is-{position} mirrors Position -->
  <!-- Content placeholder -->
  <div>Invoice #1042 sent</div>
</div>`,
	},
	properties: [
		{
			title: 'Notification',
			rows: [
				{
					name: 'StartsOpen',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Initial state. True shows the notification as soon as it is built; change it afterwards with the NotificationOpen / NotificationClose client actions.',
				},
				{
					name: 'Width',
					type: 'Text',
					defaultValue: '"370px"',
					description:
						'Width of the notification in any CSS unit (px, %, vw). Wider than the screen collapses to 100%.',
				},
				{
					name: 'Position',
					type: 'Position',
					defaultValue: 'Top',
					description:
						'Edge or spot the notification slides in from: Top, TopLeft, TopRight, Bottom, BottomLeft, BottomRight, Left, Right or Center.',
				},
				{
					name: 'OptionalConfigs.InteractToClose',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'Dismisses the notification when the user clicks it (or presses Esc). Ignored on native mobile apps.',
				},
				{
					name: 'OptionalConfigs.CloseAfterTime',
					type: 'Integer',
					defaultValue: '0',
					description:
						'Milliseconds after which the notification hides itself. 0 keeps it open until dismissed.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Notification root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires when the Notification instance is ready (NotificationId).' },
		{ name: 'OnToggle', description: 'Fires each time the notification is shown or hidden (IsOpen).' },
	],
	apiSections: [
		{
			title: 'Notification API',
			rows: [
				{ name: 'Create', description: 'Register a new Notification instance with its configs.' },
				{ name: 'Initialize', description: 'Build the notification: ARIA role, focus trap, position class.' },
				{ name: 'Show / Hide', description: 'Open or close the notification programmatically.' },
				{
					name: 'ChangeProperty',
					description:
						'Update Position, Width, InteractToClose, CloseAfterTime, NeedsSwipes or StartsOpen at runtime.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{ name: 'GetNotificationById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllNotifications', description: 'List the ids of every registered Notification.' },
				{ name: 'Dispose', description: 'Tear down the instance, its timers and listeners.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The root has role="alertdialog"; when shown it receives focus, focus is trapped inside, and ',
			React.createElement(PdKey, null, 'Esc'),
			' hides it. On hide, focus returns to the element that was focused before.'
		),
		'aria-hidden and tabindex are toggled on the root and on every focusable child, so a hidden notification is skipped by screen readers and the Tab order.',
		'Keep CloseAfterTime at 0 (or several seconds) when the content has a link or button — a short auto-close can hide it before assistive-tech users reach it.',
		'With NeedsSwipes (runtime config) a swipe away from the screen edge also dismisses the notification on touch devices.',
	],
	related: [
		{ name: 'Alert', storyId: 'patterns-content-alert--docs' },
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Tooltip', storyId: 'patterns-interaction-tooltip--docs' },
	],
};
