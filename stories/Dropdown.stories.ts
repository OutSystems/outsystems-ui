import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
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
	extendedClass: string;
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
		extendedClass: extendedClassArgType,
	},
	args: { allowMultipleSelection: false, isDisabled: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<DropdownArgs>;

function renderDropdown(args: DropdownArgs): HTMLElement {
	const id = uid('dropdown');
	// Platform markup parity: the widget root carries the mode class (osui-dropdown-search / osui-dropdown-tags)
	const modeClass = args.allowMultipleSelection ? 'osui-dropdown-tags' : 'osui-dropdown-search';
	const template = `<div ${osuiRoot(id)} class="osui-dropdown ${modeClass}" style="max-width:280px;"></div>`;
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
				ExtendedClass: args.extendedClass,
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
