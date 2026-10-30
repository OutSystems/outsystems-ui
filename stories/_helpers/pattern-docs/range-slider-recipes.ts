import type { StudioRecipe } from '../studio-recipe';

const HANDLER_STEPS = (valueParams: string): string[] => [
	'The block has no placeholders. On the Properties tab pick New Client Action in the OnValueChange handler.',
	`Store ${valueParams} in a local variable to show or filter on.`,
];

export const RANGE_SLIDER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Range Slider',
		groupProps: { MinValue: 0, MaxValue: 100, StartingValue: 40 },
		items: [{ placeholders: [{ label: 'OnValueChange handler', steps: HANDLER_STEPS('the Value parameter') }] }],
		publishStep: 'Publish the app and drag the handle: OnValueChange fires with every new value.',
	},
	interval: {
		kind: 'widget',
		widgetName: 'Range Slider Interval',
		groupProps: {
			MinValue: 0,
			MaxValue: 100,
			StartingValueFrom: 25,
			StartingValueTo: 75,
			'OptionalConfigs.ShowFloatingLabel': true,
		},
		items: [
			{
				placeholders: [
					{ label: 'OnValueChange handler', steps: HANDLER_STEPS('IntervalStart and IntervalEnd') },
				],
			},
		],
		publishStep: 'Publish the app and drag either handle: the filled segment and both labels follow.',
	},
	floatingLabel: {
		kind: 'widget',
		widgetName: 'Range Slider',
		groupProps: { MinValue: 0, MaxValue: 100, StartingValue: 65, 'OptionalConfigs.ShowFloatingLabel': true },
		items: [{ placeholders: [{ label: 'OnValueChange handler', steps: HANDLER_STEPS('the Value parameter') }] }],
		publishStep: 'Publish the app: the value floats above the handle and updates while dragging.',
	},
	tickMarks: {
		kind: 'widget',
		widgetName: 'Range Slider',
		groupProps: {
			MinValue: 0,
			MaxValue: 100,
			StartingValue: 50,
			'OptionalConfigs.Step': 25,
			'OptionalConfigs.ShowTickMarks': true,
			'OptionalConfigs.TickMarksInterval': 25,
		},
		items: [{ placeholders: [{ label: 'OnValueChange handler', steps: HANDLER_STEPS('the Value parameter') }] }],
		publishStep: 'Publish the app and drag the handle: it snaps to 0, 25, 50, 75 and 100, each marked by a pip.',
	},
} satisfies Record<string, StudioRecipe>;
