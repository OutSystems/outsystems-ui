import type { StudioRecipe } from '../studio-recipe';

const DEFAULTS = { StackedOptions: 'Bottom', Rotate: true, Items: 5, ElementsMargin: 5, UseOverlays: true };

const CONTENT = {
	label: 'Content placeholder',
	steps: [
		'Drag a List widget into the Content placeholder and bind its Source to the records to review (three destinations in this example).',
		'Drop a Card widget into the List Item with an Image widget on top and a Text widget for the title below it.',
	],
};

const OVERLAYS = {
	label: 'OverlayLeft / OverlayRight / OverlayTop placeholders',
	steps: [
		'Drag an Icon widget (x) into OverlayLeft for the reject feedback.',
		'Drag an Icon widget (heart) into OverlayRight for the accept feedback.',
		'Drag an Icon widget (info) into OverlayTop for the flag feedback.',
	],
};

export const STACKED_CARDS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Stacked Cards',
		groupProps: DEFAULTS,
		publishStep:
			'Publish the app and drag the front card sideways: it leaves the deck and the next record becomes active.',
		items: [{ placeholders: [CONTENT, OVERLAYS] }],
	},
	stackOrigin: {
		kind: 'widget',
		widgetName: 'Stacked Cards',
		groupProps: { ...DEFAULTS, StackedOptions: 'Top' },
		publishStep: 'Publish the app and compare where the back cards peek out in each deck.',
		items: [
			{
				placeholders: [
					{
						label: 'StackedOptions',
						steps: [
							'Drag one Stacked Cards block per option and set StackedOptions to Bottom on one and Top on the other.',
						],
					},
					CONTENT,
				],
			},
		],
	},
	swipeOverlays: {
		kind: 'widget',
		widgetName: 'Stacked Cards',
		groupProps: { ...DEFAULTS, UseOverlays: true },
		publishStep:
			'Publish the app and drag the front card left, right and up: the matching overlay fades in over it before it leaves.',
		items: [{ placeholders: [CONTENT, OVERLAYS] }],
	},
} satisfies Record<string, StudioRecipe>;
