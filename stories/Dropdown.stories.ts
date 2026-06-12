import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Dropdown — VirtualSelect provider. Signature is
 * `Create(id, mode, provider, configs)` (mode + provider precede configs).
 * Options are passed as `OptionsList` in the config (data-driven, not DOM).
 * VirtualSelect mounts on the element whose id === the pattern id and appends
 * its dropbox to <body>. Requires `window.VirtualSelect`.
 */
interface DropdownArgs {
	allowMultipleSelection: boolean;
	isDisabled: boolean;
}

const OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

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

function renderDropdown(args: DropdownArgs): HTMLElement {
	const id = uid('dropdown');
	const template = `<div ${osuiRoot(id)} class="osui-dropdown" style="max-width:280px;"></div>`;
	return renderPattern(template, (_root, register) => {
		const P = Patterns();
		const mode = args.allowMultipleSelection ? 'tags' : 'search';
		P.DropdownAPI.Create(
			id,
			mode,
			'virtual-select',
			cfg({
				AllowMultipleSelection: args.allowMultipleSelection,
				IsDisabled: args.isDisabled,
				OptionsList: OPTIONS,
				StartingSelection: [],
				Prompt: 'Choose a fruit',
				SearchPrompt: 'Search…',
				NoOptionsText: 'No options',
				NoResultsText: 'No results',
			})
		);
		P.DropdownAPI.Initialize(id);
		register(() => P.DropdownAPI.Dispose?.(id));
	});
}

export const Default: Story = {
	render: renderDropdown,
};

export const Tags: Story = {
	args: { allowMultipleSelection: true },
	render: renderDropdown,
};
