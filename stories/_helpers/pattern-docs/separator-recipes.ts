import type { StudioRecipe } from '../studio-recipe';

export const SEPARATOR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Separator',
		groupProps: { IsVertical: false, Space: 'Base', Color: 'Neutral4' },
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Separator has no placeholders. Drag a Text widget above it with "Content above the separator." and another below with "Content below the separator."',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm a full-width neutral rule splits the two texts with Base spacing.',
	},
	orientation: {
		kind: 'widget',
		widgetName: 'Separator',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Horizontal: drag a Separator between two Text widgets and keep IsVertical as False.',
							'Vertical: drag a Container with Style Classes "display-flex align-items-center" and a fixed height, drop a Text widget ("Left"), a Separator with IsVertical set to True, and a Text widget ("Right") inside it.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and confirm the horizontal rule spans the width and the vertical rule the height of its row.',
	},
	colors: {
		kind: 'widget',
		widgetName: 'Separator',
		groupProps: { Space: 'Small' },
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Drag one Separator per colour you want to compare (Primary, Secondary, Red, Orange, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Grape, Pink) and set Color on each.',
							'Leave the first one at the default Neutral4 as a reference.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm each rule takes the background colour of its Color entity record.',
	},
	spaces: {
		kind: 'widget',
		widgetName: 'Separator',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Drag one Separator per spacing step between an "Above" and a "Below" Text widget, and set Space to None, ExtraSmall, Small, Base, Medium, Large, ExtraLarge and XXLarge respectively.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm the gap around each rule grows with the Space value.',
	},
} satisfies Record<string, StudioRecipe>;
