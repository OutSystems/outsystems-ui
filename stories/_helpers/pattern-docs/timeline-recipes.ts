import type { StudioRecipe } from '../studio-recipe';

const CONTAINER_STEP =
	'Drag a Container into the Main Content area, open its Attributes and add role = "list"; the Timeline Items go inside it.';

export const TIMELINE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Timeline Item',
		groupProps: { IsActive: false, Color: 'Entities.Color.Primary' },
		items: [
			{
				placeholders: [
					{
						label: 'Container',
						steps: [
							CONTAINER_STEP,
							'Drag one Timeline Item per event into the container: Order placed, Payment received, Shipped, Out for delivery.',
							'On the last item set IsActive to True and Color to Entities.Color.Green.',
						],
					},
					{
						label: 'Left placeholder',
						steps: [
							'Drag a Text widget into the Left placeholder and set Text to the event date, e.g. "12 Mar".',
						],
					},
					{
						label: 'Icon placeholder',
						steps: [
							'Drag an Icon widget into the Icon placeholder and pick a glyph for the event (cart, card, package, truck).',
						],
					},
					{
						label: 'Title placeholder',
						steps: [
							'Drag a Text widget into the Title placeholder and set Text to the event name, e.g. "Shipped".',
						],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag a Text widget into the Content placeholder with the detail line, e.g. "Handed to DHL Express. Tracking 4821 0093 17."',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app — the events stack top to bottom with a connector between the markers.',
	},
	noIcon: {
		kind: 'widget',
		widgetName: 'Timeline Item',
		groupProps: { IsActive: false, Color: 'Entities.Color.Primary' },
		items: [
			{
				placeholders: [
					{
						label: 'Container',
						steps: [CONTAINER_STEP, 'Drag one Timeline Item per event into the container.'],
					},
					{
						label: 'Icon placeholder',
						steps: [
							'Leave the Icon placeholder empty — the marker collapses to an 8px dot in the chosen Color.',
						],
					},
					{
						label: 'Left, Title and Content placeholders',
						steps: [
							'Drag Text widgets for the year, the event title and its description, as in the basic example.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app — each event shows a small dot instead of the icon circle.',
	},
	colors: {
		kind: 'widget',
		widgetName: 'Timeline Item',
		groupProps: { Color: 'Entities.Color.Green' },
		items: [
			{
				placeholders: [
					{
						label: 'Container',
						steps: [
							CONTAINER_STEP,
							'Drag one Timeline Item per colour you want to compare and set Color on each (Entities.Color.Blue, Green, Red, Neutral5 …).',
						],
					},
					{
						label: 'Icon placeholder',
						steps: [
							'Drag an Icon widget into the Icon placeholder — it inherits the inverse text colour over the marker.',
						],
					},
					{
						label: 'Title placeholder',
						steps: ['Drag a Text widget into the Title placeholder with the event name.'],
					},
				],
			},
		],
		publishStep: 'Publish the app — each marker is painted with its Color value.',
	},
} satisfies Record<string, StudioRecipe>;
