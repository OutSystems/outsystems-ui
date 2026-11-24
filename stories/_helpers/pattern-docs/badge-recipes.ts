import type { StudioRecipe } from '../studio-recipe';

const NO_PLACEHOLDERS = [
	{
		label: 'No placeholders',
		steps: ['The Badge has no placeholders — the Number parameter is the text it displays.'],
	},
];

export const BADGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Badge',
		groupProps: { Number: 3, Color: 'Primary', Shape: 'Rounded', IsLight: false },
		items: [{ placeholders: NO_PLACEHOLDERS }],
		publishStep: 'Publish the app and check the badge next to the content it counts.',
	},
	lightStyle: {
		kind: 'widget',
		widgetName: 'Badge',
		groupProps: { Number: 3, Shape: 'Rounded' },
		items: [
			{
				placeholders: [
					{
						label: 'Colour variants',
						steps: [
							'Drag two Badges per colour and set Color to Primary, Green, Orange and Red on each pair.',
							'Leave IsLight False on the first Badge of each pair and set it to True on the second.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the solid and light pairs in the browser.',
	},
	sizes: {
		kind: 'widget',
		widgetName: 'Badge',
		groupProps: { Number: 3, Color: 'Primary', Shape: 'Rounded' },
		items: [
			{
				placeholders: [
					{
						label: 'Size variants',
						steps: [
							'Drag three Badges side by side.',
							'Leave Size empty on the first, set Size to Small on the second and to Medium on the third.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the three pill heights in the browser.',
	},
	shapes: {
		kind: 'widget',
		widgetName: 'Badge',
		groupProps: { Number: 3, Color: 'Primary', Size: 'Medium' },
		items: [
			{
				placeholders: [
					{
						label: 'Shape variants',
						steps: [
							'Drag one Badge per shape and set Shape to Sharp, SoftRounded and Rounded.',
							'For a fully circular badge keep Shape Rounded and add border-radius-circle in ExtendedClass.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the corner radius of each badge in the browser.',
	},
} satisfies Record<string, StudioRecipe>;
