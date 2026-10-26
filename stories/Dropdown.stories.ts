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
		allowMultipleSelection: { control: 'boolean', name: 'AllowMultipleSelection' },
		isDisabled: { control: 'boolean', name: 'IsDisabled' },
	},
	args: { allowMultipleSelection: false, isDisabled: false },
};
export default meta;

type Story = StoryObj<DropdownArgs>;

export const Default: Story = {
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

/** Enabled next to disabled (`IsDisabled: true`). */
export const States: Story = {
	parameters: { controls: { disable: true } },
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
