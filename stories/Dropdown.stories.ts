import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern, uid } from './_helpers/osui';
import { dropdownMarkup, initDropdown, pinDropdownOpen } from './_helpers/dropdown';
import { labeledBoard } from './_helpers/showcase';

/**
 * Dropdown — the search-mode VirtualSelect dropdown (the low-code `Dropdown`
 * block). Single selection by default; `AllowMultipleSelection` turns on
 * checkbox multi-select. The tags variant is a separate pattern — see
 * `DropdownTags.stories.ts`. Harness contract in `_helpers/dropdown.ts`.
 */
interface DropdownArgs {
	allowMultipleSelection: boolean;
	isDisabled: boolean;
}

const meta: Meta<DropdownArgs> = {
	title: 'Patterns/Interaction/Dropdown',
	argTypes: {
		allowMultipleSelection: {
			control: 'boolean',
			name: 'OptionalConfigs.AllowMultipleSelection',
			description: 'Lets the user select more than one option.',
		},
		isDisabled: {
			control: 'boolean',
			name: 'OptionalConfigs.IsDisabled',
			description: 'Renders the dropdown disabled.',
		},
	},
	args: { allowMultipleSelection: false, isDisabled: false },
};
export default meta;

type Story = StoryObj<DropdownArgs>;

export const Playground: Story = {
	render: (args) => {
		const id = uid('dropdown');
		return renderPattern(dropdownMarkup(id, 'search'), (_root, register) =>
			initDropdown(
				id,
				'search',
				{ AllowMultipleSelection: args.allowMultipleSelection, IsDisabled: args.isDisabled },
				register
			)
		);
	},
};

/** Product-like option set for the docs examples (the Playground keeps the shared fruit list). */
const TEAM_OPTIONS = [
	{ label: 'Design', value: 'design' },
	{ label: 'Engineering', value: 'engineering' },
	{ label: 'Marketing', value: 'marketing' },
	{ label: 'Sales', value: 'sales' },
	{ label: 'Support', value: 'support' },
];

/** One search-mode dropdown over `TEAM_OPTIONS`, initialised exactly like the Playground. */
function docsDropdown(configs: Record<string, unknown>): HTMLElement {
	const id = uid('dropdown');
	return renderPattern(dropdownMarkup(id, 'search'), (_root, register) =>
		initDropdown(id, 'search', { OptionsList: TEAM_OPTIONS, Prompt: 'Assign to a team', ...configs }, register)
	);
}

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Single selection with the default search box: open the control, type to filter the OptionsList, pick one option and the dropbox closes.',
			},
		},
	},
	render: () => docsDropdown({}),
};

export const MultipleSelection: Story = {
	tags: ['docs-example'],
	name: 'Multiple selection',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'OptionalConfigs.AllowMultipleSelection set to True: every option gets a checkbox, the dropbox stays open while the user picks, and the control summarises the count once more than one option is selected.',
			},
		},
	},
	render: () => docsDropdown({ AllowMultipleSelection: true }),
};

export const StartingSelection: Story = {
	tags: ['docs-example'],
	name: 'Starting selection',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'StartingSelection pre-selects an option when the dropdown is built, so the control opens with a value instead of the Prompt.',
			},
		},
	},
	render: () => docsDropdown({ StartingSelection: [{ label: 'Engineering', value: 'engineering' }] }),
};

/** Enabled next to disabled (`IsDisabled: true`). */
export const States: Story = {
	tags: ['docs-example'],
	name: 'Disabled state',
	parameters: {
		controls: { disable: true },
		layout: 'padded',
		docs: {
			description: {
				story: 'OptionalConfigs.IsDisabled set to True renders the control greyed out and non-interactive, next to the default enabled one.',
			},
		},
	},
	render: () => {
		const entries = [
			{ label: 'enabled', isDisabled: false },
			{ label: 'disabled', isDisabled: true },
		].map((v) => ({ ...v, id: uid('dropdown') }));
		const board = labeledBoard(
			entries.map(({ label, id }) => ({
				label,
				html: `<div style="width:280px;">${dropdownMarkup(id, 'search')}</div>`,
			})),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, isDisabled } of entries) {
				initDropdown(id, 'search', { IsDisabled: isDisabled }, register);
			}
		});
	},
};

/**
 * The selection states: dropbox pinned open (single), one option selected,
 * multi-select open (checkboxes), and multi-select with several selected
 * ("2 options selected"). Open cells use VirtualSelect `keepAlwaysOpen` via
 * `SetProviderConfigs` (see `pinDropdownOpen`).
 */
export const SelectionStates: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const variants: Array<{
			label: string;
			open: boolean;
			configs: Record<string, unknown>;
		}> = [
			{ label: 'open', open: true, configs: {} },
			{
				label: 'one selected',
				open: false,
				configs: { StartingSelection: [{ label: 'Banana', value: 'banana' }] },
			},
			{ label: 'multiple options (open)', open: true, configs: { AllowMultipleSelection: true } },
			{
				label: 'multiple selected',
				open: false,
				configs: {
					AllowMultipleSelection: true,
					StartingSelection: [
						{ label: 'Apple', value: 'apple' },
						{ label: 'Cherry', value: 'cherry' },
					],
				},
			},
		];
		const entries = variants.map((v) => ({ ...v, id: uid('dropdown') }));
		const board = labeledBoard(
			entries.map(({ label, id, open }) => ({
				label,
				html: `<div style="width:280px;${open ? 'height:260px;' : ''}">${dropdownMarkup(id, 'search')}</div>`,
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, open, configs } of entries) {
				initDropdown(id, 'search', configs, register);
				if (open) {
					pinDropdownOpen(id);
				}
			}
		});
	},
};
