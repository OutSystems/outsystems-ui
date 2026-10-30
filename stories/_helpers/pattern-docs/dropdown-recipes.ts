import type { StudioRecipe } from '../studio-recipe';

const OPTIONS_LIST_STEPS = [
	'Create a local variable of type DropdownOption List (for example Teams) and fill it in an OnInitialize action with one record per option — Design, Engineering, Marketing, Sales, Support — setting value and label.',
	'Set OptionsList to that variable.',
] as const;

const ON_CHANGED_STEPS = [
	'Open the OnChanged event handler and create a new client action.',
	'Assign the SelectedOptionList output to a local variable to keep the current selection.',
] as const;

export const DROPDOWN_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Dropdown Search',
		groupProps: { Prompt: 'Assign to a team' },
		publishStep: 'Publish the app, open the dropdown and type to filter the options in the browser.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{ label: 'OnChanged event', steps: [...ON_CHANGED_STEPS] },
				],
			},
		],
	},
	multipleSelection: {
		kind: 'widget',
		widgetName: 'Dropdown Search',
		groupProps: { Prompt: 'Assign to a team', 'OptionalConfigs.AllowMultipleSelection': true },
		publishStep:
			'Publish the app and tick more than one option — the dropdown stays open and shows the selected count.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{
						label: 'OnChanged event',
						steps: [
							'Open the OnChanged event handler and create a new client action.',
							'SelectedOptionList now holds every ticked option — iterate it or bind it to a list variable.',
						],
					},
				],
			},
		],
	},
	startingSelection: {
		kind: 'widget',
		widgetName: 'Dropdown Search',
		groupProps: { Prompt: 'Assign to a team' },
		publishStep: 'Publish the app — the dropdown renders with Engineering already selected.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{
						label: 'StartingSelection parameter',
						steps: [
							'Create a second DropdownOption List variable holding the record to pre-select (value "engineering", label "Engineering").',
							'Set StartingSelection to that variable.',
						],
					},
					{ label: 'OnChanged event', steps: [...ON_CHANGED_STEPS] },
				],
			},
		],
	},
	disabled: {
		kind: 'widget',
		widgetName: 'Dropdown Search',
		groupProps: { Prompt: 'Assign to a team', 'OptionalConfigs.IsDisabled': true },
		publishStep: 'Publish the app — the dropdown renders greyed out and does not open.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{
						label: 'OptionalConfigs.IsDisabled parameter',
						steps: [
							'Bind IsDisabled to a Boolean variable instead of a literal to toggle the control from screen logic.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
