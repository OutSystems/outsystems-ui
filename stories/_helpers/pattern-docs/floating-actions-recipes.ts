import type { StudioRecipe } from '../studio-recipe';

const ACTIONS = [
	['New message', 'envelope'],
	['Add contact', 'user-plus'],
	['Schedule', 'calendar-plus'],
] as const;

const STACK_PLACEHOLDERS = [
	{
		label: 'Button placeholder',
		steps: ['Drag an Icon widget into the Button placeholder.', 'Set the icon to plus.'],
	},
	{
		label: 'Items placeholder',
		steps: [
			`Drag one Floating Actions Item per action into the Items placeholder (${ACTIONS.length} in this example).`,
			...ACTIONS.map(
				([label, icon]) =>
					`In one item, drag a Text widget into the Label placeholder with Text "${label}" and an Icon widget (${icon}) into the Item placeholder.`
			),
		],
	},
];

export const FLOATING_ACTIONS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Floating Actions',
		groupProps: { IsExpanded: false, IsHover: false },
		publishStep:
			'Publish the app, click the floating button and check the three actions fan out above it; click it again or press Esc to close.',
		items: [{ placeholders: STACK_PLACEHOLDERS }],
	},
	startsExpanded: {
		kind: 'widget',
		widgetName: 'Floating Actions',
		groupProps: { IsExpanded: true, IsHover: false },
		publishStep: 'Publish the app and check the actions are already visible when the screen loads.',
		items: [{ placeholders: STACK_PLACEHOLDERS }],
	},
	hoverTrigger: {
		kind: 'widget',
		widgetName: 'Floating Actions',
		groupProps: { IsExpanded: false, IsHover: true },
		publishStep:
			'Publish the app and hover the floating button: the actions open without a click and close when the pointer leaves.',
		items: [{ placeholders: STACK_PLACEHOLDERS }],
	},
} satisfies Record<string, StudioRecipe>;
