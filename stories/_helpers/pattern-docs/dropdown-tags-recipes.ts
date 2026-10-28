import type { StudioRecipe } from '../studio-recipe';

const OPTIONS_LIST_STEPS = [
	'Create a local variable of type DropdownOption List (for example Skills) and fill it in an OnInitialize action with one record per option — Accessibility, Design systems, Prototyping, User research, Visual design — setting value and label.',
	'Set OptionsList to that variable.',
] as const;

const ON_CHANGED_STEPS = [
	'Open the OnChanged event handler and create a new client action.',
	'Assign the SelectedOptionList output to a local variable — it holds every chip currently selected.',
] as const;

export const DROPDOWN_TAGS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Dropdown Tags',
		groupProps: { Prompt: 'Add skills' },
		publishStep: 'Publish the app, tick a few options and remove one from its chip in the browser.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{ label: 'OnChanged event', steps: [...ON_CHANGED_STEPS] },
				],
			},
		],
	},
	startingSelection: {
		kind: 'widget',
		widgetName: 'Dropdown Tags',
		groupProps: { Prompt: 'Add skills' },
		publishStep:
			'Publish the app — the control renders with the Accessibility and Prototyping chips already in place.',
		items: [
			{
				placeholders: [
					{ label: 'OptionsList parameter', steps: [...OPTIONS_LIST_STEPS] },
					{
						label: 'StartingSelection parameter',
						steps: [
							'Create a second DropdownOption List variable holding the records to pre-select (value "a11y", label "Accessibility"; value "prototyping", label "Prototyping").',
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
		widgetName: 'Dropdown Tags',
		groupProps: { Prompt: 'Add skills', 'OptionalConfigs.IsDisabled': true },
		publishStep: 'Publish the app — the control renders greyed out and does not open.',
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
