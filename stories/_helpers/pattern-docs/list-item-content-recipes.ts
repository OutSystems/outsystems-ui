import type { StudioRecipe } from '../studio-recipe';

export const LIST_ITEM_CONTENT_RECIPES = {
	basicRow: {
		kind: 'widget',
		widgetName: 'List Item Content',
		publishStep: 'Place the List Item Content inside a List Item within a List widget, then publish.',
		items: [
			{
				placeholders: [
					{ label: 'Left placeholder', steps: ['Drag an Avatar or Icon widget.'] },
					{
						label: 'Center placeholder',
						steps: [
							'Drag Text widgets for title and supporting text.',
							'Use list-item-content-title and list-item-content-text regions.',
						],
					},
					{ label: 'Right placeholder', steps: ['Optional trailing icon, badge, or action.'] },
				],
			},
		],
	},
	inList: {
		kind: 'widget',
		widgetName: 'List',
		publishStep: 'Add List Item widgets inside the List, each with List Item Content, then publish.',
		items: [
			{
				placeholders: [
					{
						label: 'List structure',
						steps: [
							'Drag a List widget into Main Content.',
							'Add List Item widgets inside the List.',
							'In each List Item, configure List Item Content placeholders.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
