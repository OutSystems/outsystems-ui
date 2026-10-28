import type { StudioRecipe } from '../studio-recipe';

const SELECTED_VALUES_STEPS = [
	'Drag an Expression widget into the SelectedValues placeholder.',
	'Set its Value to the label of the selected option (for example SelectedTeam.Label), falling back to a prompt such as "Choose a team" while nothing is selected.',
] as const;

const SEARCH_INPUT_STEPS = [
	'Drag an Input widget into the BalloonSearchInput placeholder and bind it to a Text variable (for example SearchTerm).',
	'In its OnChange handler, refresh the aggregate that feeds the list, filtered by SearchTerm.',
] as const;

const BALLOON_FOOTER_STEPS = [
	'Leave the BalloonFooter placeholder empty (it is hidden) or drop a Button with a "Clear" action.',
] as const;

function balloonContentSteps(multiple: boolean): string[] {
	return [
		'Drag a List widget into the BalloonContent placeholder and set its Source to the aggregate (or paginated API call) that returns the options.',
		'Drag a Dropdown Server Side Item into the List. Set ItemId to the record identifier (for example GetTeams.List.Current.Team.Id).',
		multiple
			? 'Set IsSelected to an expression that checks whether the record id is in your SelectedIds list.'
			: 'Set IsSelected to GetTeams.List.Current.Team.Id = SelectedTeam.Id.',
		'Drag an Expression into the DropdownItemContent placeholder showing the record label.',
		multiple
			? 'In the item OnSelected handler, add or remove ItemOptionId from SelectedIds and refresh the List.'
			: 'In the item OnSelected handler, assign the picked record to SelectedTeam using ItemOptionId.',
	];
}

export const DROPDOWN_SERVER_SIDE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Dropdown Server Side',
		groupProps: { AllowMultipleSelection: false, IsDisabled: false },
		publishStep:
			'Publish the app, open the dropdown and pick an option — the balloon closes and the trigger shows your expression.',
		items: [
			{
				placeholders: [
					{ label: 'SelectedValues placeholder', steps: [...SELECTED_VALUES_STEPS] },
					{ label: 'BalloonSearchInput placeholder', steps: [...SEARCH_INPUT_STEPS] },
					{ label: 'BalloonContent placeholder', steps: balloonContentSteps(false) },
					{ label: 'BalloonFooter placeholder', steps: [...BALLOON_FOOTER_STEPS] },
				],
			},
		],
	},
	multipleSelection: {
		kind: 'widget',
		widgetName: 'Dropdown Server Side',
		groupProps: { AllowMultipleSelection: true, IsDisabled: false },
		publishStep:
			'Publish the app and pick several options — the balloon stays open and each selected item keeps its highlight.',
		items: [
			{
				placeholders: [
					{
						label: 'SelectedValues placeholder',
						steps: [
							'Drag an Expression widget into the SelectedValues placeholder.',
							'Set its Value to the selected labels joined with ", " (or a count such as SelectedIds.Length + " selected"), falling back to a prompt while nothing is selected.',
						],
					},
					{ label: 'BalloonSearchInput placeholder', steps: [...SEARCH_INPUT_STEPS] },
					{ label: 'BalloonContent placeholder', steps: balloonContentSteps(true) },
					{
						label: 'BalloonFooter placeholder',
						steps: [
							'Drop a Button labelled "Apply" that closes the dropdown with the Close client action.',
						],
					},
				],
			},
		],
	},
	disabled: {
		kind: 'widget',
		widgetName: 'Dropdown Server Side',
		groupProps: { AllowMultipleSelection: false, IsDisabled: true },
		publishStep: 'Publish the app — the trigger renders greyed out and the balloon never opens.',
		items: [
			{
				placeholders: [
					{ label: 'SelectedValues placeholder', steps: [...SELECTED_VALUES_STEPS] },
					{ label: 'BalloonContent placeholder', steps: balloonContentSteps(false) },
					{
						label: 'IsDisabled parameter',
						steps: [
							'Bind IsDisabled to a Boolean variable instead of a literal to toggle the control from screen logic.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
