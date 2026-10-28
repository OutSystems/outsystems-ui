import type { StudioRecipe } from '../studio-recipe';

const BIND_STEPS = [
	'Create a local Boolean variable (for example IsSaving, default False) and bind IsLoading to it.',
	'In the button OnClick action, assign IsSaving = True before the server action and IsSaving = False at the end.',
] as const;

export const BUTTON_LOADING_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Button Loading',
		groupProps: { IsLoading: true, ShowLabelOnLoading: true },
		items: [
			{
				placeholders: [
					{
						label: 'Button placeholder',
						steps: [
							'Drag a Button widget into the Button placeholder.',
							'Set Label to "Save changes" and keep Style as Primary.',
						],
					},
					{ label: 'Loading state', steps: [...BIND_STEPS] },
				],
			},
		],
		publishStep:
			'Publish the app, click the button and confirm the spinner shows beside the label until the action finishes.',
	},
	states: {
		kind: 'widget',
		widgetName: 'Button Loading',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Button placeholder',
						steps: [
							'Drag three Button Loading widgets side by side (a Columns widget works well) and drop a Button labelled "Save changes" into each Button placeholder.',
							'First widget: set IsLoading to False — the idle button.',
							'Second widget: set IsLoading to True and ShowLabelOnLoading to True — spinner beside the label.',
							'Third widget: set IsLoading to True and ShowLabelOnLoading to False — spinner only.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the three buttons in the browser.',
	},
	spinnerOnly: {
		kind: 'widget',
		widgetName: 'Button Loading',
		groupProps: { IsLoading: true, ShowLabelOnLoading: false },
		items: [
			{
				placeholders: [
					{
						label: 'Button placeholder',
						steps: ['Drag a Button widget into the Button placeholder.', 'Set Label to "Submit order".'],
					},
					{ label: 'Loading state', steps: [...BIND_STEPS] },
				],
			},
		],
		publishStep: 'Publish the app and confirm only the spinner is visible while the order is being submitted.',
	},
} satisfies Record<string, StudioRecipe>;
