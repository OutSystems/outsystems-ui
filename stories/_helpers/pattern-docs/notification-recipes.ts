import type { StudioRecipe } from '../studio-recipe';

const INVOICE_CONTENT = {
	label: 'Content placeholder',
	steps: [
		'Drag an Icon widget (check-circle) into the Content placeholder.',
		'Drag a Text widget next to it with Text "Invoice #1042 sent", and a second one with "The customer will receive a copy by email.".',
	],
};

function trigger(buttonText: string): { label: string; steps: string[] } {
	return {
		label: 'Trigger (outside the block)',
		steps: [
			`Drag a Button widget above the block and set Text to "${buttonText}".`,
			"In its OnClick action, call the NotificationOpen client action with the block's Id.",
		],
	};
}

export const NOTIFICATION_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Notification',
		groupProps: { StartsOpen: false, Width: '370px', Position: 'Top' },
		publishStep:
			'Publish the app, click the button and check the notification slides in from the top; click it or press Esc to dismiss.',
		items: [{ placeholders: [INVOICE_CONTENT, trigger('Send invoice')] }],
	},
	position: {
		kind: 'widget',
		widgetName: 'Notification',
		groupProps: { StartsOpen: false, Width: '260px', Position: 'Top' },
		publishStep: 'Publish the app and open each notification to compare the edge it slides in from.',
		items: [
			{
				placeholders: [
					{
						label: 'Position',
						steps: [
							'Drag one Notification per position and set Position to Top, BottomRight and Center.',
							'Drag a Text widget into each Content placeholder naming the position.',
						],
					},
					{
						label: 'Trigger (outside the block)',
						steps: [
							"Drag one Button widget per notification and call NotificationOpen with that block's Id in its OnClick action.",
						],
					},
				],
			},
		],
	},
	autoClose: {
		kind: 'widget',
		widgetName: 'Notification',
		groupProps: { StartsOpen: false, Position: 'Top', 'OptionalConfigs.CloseAfterTime': 3000 },
		publishStep:
			'Publish the app, click the button and check the notification hides by itself after three seconds.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag an Icon widget (floppy-disk) into the Content placeholder.',
							'Drag a Text widget next to it with Text "Draft saved — this closes in 3 seconds.".',
						],
					},
					trigger('Save draft'),
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
