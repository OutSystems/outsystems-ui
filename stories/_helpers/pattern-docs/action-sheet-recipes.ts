import type { StudioRecipe } from '../studio-recipe';

const PHOTO_ACTIONS = ['Share photo', 'Save to album', 'Delete photo'] as const;

const ACTION_PLACEHOLDERS = PHOTO_ACTIONS.map((label, index) => ({
	label: `Button${index + 1} placeholder`,
	steps: [`Drag a Button widget into the Button${index + 1} placeholder.`, `Set Text to "${label}".`],
}));

export const ACTION_SHEET_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Action Sheet',
		groupProps: { IsOpen: 'IsActionSheetOpen' },
		publishStep:
			'Publish the app, tap the button and check the sheet slides up over a backdrop; tap the backdrop to close it.',
		items: [
			{
				placeholders: [
					{
						label: 'Trigger (outside the block)',
						steps: [
							'Create a local Boolean variable IsActionSheetOpen (default False) and bind it to IsOpen.',
							'Drag a Button widget above the block, set Text to "Open action sheet" and, in its OnClick action, assign IsActionSheetOpen = True.',
							'In the OnClose event handler, assign IsActionSheetOpen = False.',
						],
					},
					...ACTION_PLACEHOLDERS,
				],
			},
		],
	},
	openState: {
		kind: 'widget',
		widgetName: 'Action Sheet',
		groupProps: { IsOpen: true },
		publishStep: 'Publish the app and check the sheet is already open when the screen loads.',
		items: [
			{
				placeholders: [
					{
						label: 'IsOpen',
						steps: [
							'For a sheet that is open on load, bind IsOpen to a Boolean variable whose default is True.',
							'In the OnClose event handler, assign that variable to False so the sheet can be reopened later.',
						],
					},
					...ACTION_PLACEHOLDERS,
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
