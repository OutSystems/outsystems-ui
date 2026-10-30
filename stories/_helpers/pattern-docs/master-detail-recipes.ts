import type { StudioRecipe } from '../studio-recipe';

const LEFT_CONTENT_STEPS = [
	'Drag a List widget into the LeftContent placeholder and set its Source to the Employees aggregate.',
	'Inside the list item, drag a List Item Content widget with the employee name as Title and the role as Text.',
	'Add an OnClick handler to the list item that assigns the selected record to a local SelectedEmployee variable.',
] as const;

const RIGHT_CONTENT_STEPS = [
	'Drag Text widgets into the RightContent placeholder bound to SelectedEmployee.Name, Role, Team and Email.',
] as const;

export const MASTER_DETAIL_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Master Detail',
		groupProps: { LeftPercentage: 50, OpenedOnPhone: false },
		publishStep: 'Publish the app and click through the list to see the detail pane update beside it.',
		items: [
			{
				placeholders: [
					{ label: 'LeftContent placeholder', steps: [...LEFT_CONTENT_STEPS] },
					{ label: 'RightContent placeholder', steps: [...RIGHT_CONTENT_STEPS] },
				],
			},
		],
	},
	leftPercentage: {
		kind: 'widget',
		widgetName: 'Master Detail',
		groupProps: { LeftPercentage: 30, OpenedOnPhone: false, Height: '220px' },
		publishStep: 'Publish the app and compare the split; change LeftPercentage to 50 or 70 and republish.',
		items: [
			{
				placeholders: [
					{ label: 'LeftContent placeholder', steps: [...LEFT_CONTENT_STEPS] },
					{ label: 'RightContent placeholder', steps: [...RIGHT_CONTENT_STEPS] },
				],
			},
		],
	},
	openedOnPhone: {
		kind: 'widget',
		widgetName: 'Master Detail',
		groupProps: { LeftPercentage: 50, OpenedOnPhone: 'IsDetailOpen' },
		publishStep:
			'Publish the app and open it on a phone (or device emulation): tapping a row slides the detail in, the back arrow slides it out.',
		items: [
			{
				placeholders: [
					{
						label: 'LeftContent placeholder',
						steps: [
							...LEFT_CONTENT_STEPS,
							'Create a local Boolean variable IsDetailOpen and bind it to OpenedOnPhone; in the same OnClick handler, assign IsDetailOpen = True.',
						],
					},
					{ label: 'RightContent placeholder', steps: [...RIGHT_CONTENT_STEPS] },
					{
						label: 'DetailClose event',
						steps: ['Create a handler for DetailClose that assigns IsDetailOpen = False.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
