import type { StudioRecipe } from '../studio-recipe';

const CARD_CONTENT_STEPS = [
	'Drag a List widget into the Content placeholder and bind its Source to the records to show (for example recent files).',
	'Drag a Card widget into the List and drop a Text for the title and a Text with the font-size-s text-neutral-7 classes for the subtitle.',
	'Set the Card Width to 180px through its style (or ExtendedClass) so several cards overflow the area.',
] as const;

export const SCROLLABLE_AREA_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Scrollable Area',
		groupProps: { Orientation: 'Horizontal', Width: '360px', ScrollbarStyle: 'Default' },
		publishStep: 'Publish the app and drag the strip sideways (or use the scrollbar) in the browser.',
		items: [{ placeholders: [{ label: 'Content placeholder', steps: [...CARD_CONTENT_STEPS] }] }],
	},
	vertical: {
		kind: 'widget',
		widgetName: 'Scrollable Area',
		groupProps: { Orientation: 'Vertical', Height: '220px', Width: '320px', ScrollbarStyle: 'Default' },
		publishStep: 'Publish the app — the list stacks and scrolls inside the 220px-high area.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag a List widget into the Content placeholder and bind its Source to the records to show.',
							'Drag a Card widget into the List with the item text; leave the width to the container so the cards stack.',
							'Height is what makes the area scroll: keep it smaller than the total height of the content.',
						],
					},
				],
			},
		],
	},
	scrollbarStyles: {
		kind: 'widget',
		widgetName: 'Scrollable Area',
		groupProps: { Orientation: 'Horizontal', Width: '320px' },
		publishStep:
			'Publish the app and hover each area — Default shows the native bar, Compact a slim thumb, None nothing at all.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag one Scrollable Area per style and set ScrollbarStyle to Default, Compact and None respectively.',
							'Drop the same List of Cards into each Content placeholder so the three can be compared side by side.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
