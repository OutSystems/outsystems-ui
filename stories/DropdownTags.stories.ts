import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern, uid } from './_helpers/osui';
import { dropdownMarkup, initDropdown, pinDropdownOpen } from './_helpers/dropdown';
import { labeledBoard } from './_helpers/showcase';

/**
 * Dropdown Tags — the tags-mode VirtualSelect dropdown (the low-code
 * `DropdownTags` block). Always multi-select; the selection renders as chips
 * (`showValueAsTags`). Split out of `Dropdown.stories.ts` — harness contract
 * in `_helpers/dropdown.ts`.
 */
interface DropdownTagsArgs {
	isDisabled: boolean;
}

const meta: Meta<DropdownTagsArgs> = {
	title: 'Patterns/Interaction/Dropdown Tags',
	argTypes: {
		isDisabled: {
			control: 'boolean',
			name: 'OptionalConfigs.IsDisabled',
			description: 'Renders the dropdown disabled.',
		},
	},
	args: { isDisabled: false },
};
export default meta;

type Story = StoryObj<DropdownTagsArgs>;

const TAGS_SELECTION = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
];

export const Playground: Story = {
	render: (args) => {
		const id = uid('dropdown-tags');
		return renderPattern(dropdownMarkup(id, 'tags'), (_root, register) =>
			initDropdown(id, 'tags', { IsDisabled: args.isDisabled }, register)
		);
	},
};

/** Enabled next to disabled (`IsDisabled: true`). */
export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const entries = [
			{ label: 'enabled', isDisabled: false },
			{ label: 'disabled', isDisabled: true },
		].map((v) => ({ ...v, id: uid('dropdown-tags') }));
		const board = labeledBoard(
			entries.map(({ label, id }) => ({
				label,
				html: `<div style="width:280px;">${dropdownMarkup(id, 'tags')}</div>`,
			})),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, isDisabled } of entries) {
				initDropdown(id, 'tags', { IsDisabled: isDisabled }, register);
			}
		});
	},
};

/**
 * Tags opened and tags selected: the dropbox pinned open with two options
 * ticked (chips + checked list), and the closed control showing the selection
 * as chips. Open cell uses VirtualSelect `keepAlwaysOpen` via
 * `SetProviderConfigs` (see `pinDropdownOpen`).
 */
export const OpenAndSelected: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const entries = [
			{ label: 'open (2 selected)', open: true, id: uid('dropdown-tags') },
			{ label: 'selected', open: false, id: uid('dropdown-tags') },
		];
		const board = labeledBoard(
			entries.map(({ label, id, open }) => ({
				label,
				html: `<div style="width:280px;${open ? 'height:280px;' : ''}">${dropdownMarkup(id, 'tags')}</div>`,
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, open } of entries) {
				initDropdown(id, 'tags', { StartingSelection: TAGS_SELECTION }, register);
				if (open) {
					pinDropdownOpen(id);
				}
			}
		});
	},
};
