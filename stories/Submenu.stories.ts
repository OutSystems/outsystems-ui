import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

interface SubmenuArgs {
	openOnHover: boolean;
}

const meta: Meta<SubmenuArgs> = {
	title: 'Patterns/Navigation/Submenu',
	argTypes: { openOnHover: { control: 'boolean', name: 'OpenOnHover' } },
	args: { openOnHover: false },
};
export default meta;

type Story = StoryObj<SubmenuArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('submenu');
		const template = `
			<div ${osuiRoot(id)} class="osui-submenu" style="width:220px;">
				<button class="osui-submenu__header" id="${id}-header" type="button">
					<span class="osui-submenu__header__item">Products</span>
					<span class="osui-submenu__header__icon">▾</span>
				</button>
				<div class="osui-submenu__items" id="${id}-items">
					<a href="#one">Analytics</a>
					<a href="#two">Automation</a>
					<a href="#three">Integrations</a>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('SubmenuAPI', id, { OpenOnHover: args.openOnHover }, register)
		);
	},
};
