import type { StudioRecipe } from '../studio-recipe';

const ITEM_STEPS = [
	'Drag four Wizard Item widgets into the Content placeholder: Account, Profile, Address, Confirm.',
	'Set Status to Entities.Steps.Past on Account, Entities.Steps.Active on Profile and Entities.Steps.Next on the rest.',
];

const LABEL_STEPS = ['Drag a Text widget into each Label placeholder and set Text to the step name.'];

const NUMBER_STEPS = ['Drag a Text widget into each Icon placeholder with the step number (1, 2, 3, 4).'];

export const WIZARD_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Wizard',
		groupProps: { IsVertical: false, StepsBehaviour: 'Entities.StepsBehaviour.Interactive' },
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: ITEM_STEPS },
					{ label: 'Label placeholder (each Wizard Item)', steps: LABEL_STEPS },
					{ label: 'Icon placeholder (each Wizard Item)', steps: NUMBER_STEPS },
				],
			},
		],
		publishStep:
			'Publish the app and click the Account step — it is clickable because it is Past and the Wizard is Interactive.',
	},
	vertical: {
		kind: 'widget',
		widgetName: 'Wizard',
		groupProps: { IsVertical: true, StepsBehaviour: 'Entities.StepsBehaviour.ProgressOnly' },
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: ITEM_STEPS },
					{ label: 'Label placeholder (each Wizard Item)', steps: LABEL_STEPS },
					{ label: 'Icon placeholder (each Wizard Item)', steps: NUMBER_STEPS },
				],
			},
		],
		publishStep: 'Publish the app — the steps stack top to bottom with the connector running down the markers.',
	},
	markerIcon: {
		kind: 'widget',
		widgetName: 'Wizard',
		groupProps: { IsVertical: false, StepsBehaviour: 'Entities.StepsBehaviour.ProgressOnly' },
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: ITEM_STEPS },
					{ label: 'Label placeholder (each Wizard Item)', steps: LABEL_STEPS },
					{
						label: 'Icon placeholder (each Wizard Item)',
						steps: [
							'Drag an Icon widget into each Icon placeholder and pick a glyph for the step (user, identification card, map pin, check).',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app — each marker shows its icon instead of a number.',
	},
	markerEmpty: {
		kind: 'widget',
		widgetName: 'Wizard',
		groupProps: { IsVertical: false, StepsBehaviour: 'Entities.StepsBehaviour.ProgressOnly' },
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: ITEM_STEPS },
					{ label: 'Label placeholder (each Wizard Item)', steps: LABEL_STEPS },
					{
						label: 'Icon placeholder (each Wizard Item)',
						steps: ['Leave the Icon placeholder empty — the marker collapses to a dot.'],
					},
				],
			},
		],
		publishStep: 'Publish the app — the steps show small dots joined by the connector.',
	},
} satisfies Record<string, StudioRecipe>;
