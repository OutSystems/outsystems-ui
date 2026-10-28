import type { StudioRecipe } from '../studio-recipe';

const HELP_ICON_PLACEHOLDERS = [
	{
		label: 'Content placeholder',
		steps: [
			'Drag an Icon widget into the Content placeholder and set the icon to question.',
			'Place the block right after the "VAT number" label of the field it explains.',
		],
	},
	{
		label: 'Tooltip placeholder',
		steps: [
			'Drag a Text widget into the Tooltip placeholder.',
			'Set Text to "Your 9-digit VAT registration number, without the country prefix.".',
		],
	},
];

export const TOOLTIP_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Tooltip',
		groupProps: { Position: 'Right', Trigger: 'OnHover', StartsOpen: false },
		publishStep: 'Publish the app and hover (or tab to) the help icon: the hint opens to its right.',
		items: [{ placeholders: HELP_ICON_PLACEHOLDERS }],
	},
	startsOpen: {
		kind: 'widget',
		widgetName: 'Tooltip',
		groupProps: { Position: 'Bottom', Trigger: 'OnHover', StartsOpen: true },
		publishStep: 'Publish the app and check the balloon is already visible when the screen loads.',
		items: [{ placeholders: HELP_ICON_PLACEHOLDERS }],
	},
	clickTrigger: {
		kind: 'widget',
		widgetName: 'Tooltip',
		groupProps: { Position: 'Bottom', Trigger: 'OnClick', StartsOpen: false },
		publishStep:
			'Publish the app and click the button: the balloon opens below it and closes on Esc or a click elsewhere.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag a Button widget into the Content placeholder.',
							'Set Text to "Why is this required?" and Style to Link.',
						],
					},
					{
						label: 'Tooltip placeholder',
						steps: [
							'Drag a Text widget into the Tooltip placeholder.',
							'Set Text to "We need a VAT number to issue a compliant invoice for business purchases within the EU.".',
						],
					},
				],
			},
		],
	},
	positions: {
		kind: 'widget',
		widgetName: 'Tooltip',
		groupProps: { Trigger: 'OnHover', StartsOpen: true },
		publishStep: 'Publish the app and compare where each balloon opens relative to its trigger.',
		items: [
			{
				placeholders: [
					{
						label: 'Position',
						steps: [
							'Drag one Tooltip per value and set Position to Top, TopLeft, TopRight, Bottom, BottomLeft, BottomRight, Left, Right and Center.',
							'Space the blocks out on the screen so the open balloons do not overlap.',
						],
					},
					{
						label: 'Content and Tooltip placeholders',
						steps: [
							'Drag a Button widget into each Content placeholder and a Text widget into each Tooltip placeholder, both naming the position.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
